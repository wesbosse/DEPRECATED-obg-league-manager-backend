// // Copyright IBM Corp. 2019,2020. All Rights Reserved.
// // Node module: @loopback/example-todo
// // This file is licensed under the MIT License.
// // License text available at https://opensource.org/licenses/MIT

// import { EntityNotFoundError } from '@loopback/repository';
// import { Request, Response, RestBindings } from '@loopback/rest';
// import {
//   Client,
//   createRestAppClient,
//   expect,
//   givenHttpServerConfig,
//   toJSON,
// } from '@loopback/testlab';
// import morgan from 'morgan';
// import { LeagueManagerApplication } from '../../application';
// import { Game } from '../../models/';
// import { GameRepository } from '../../repositories/';
// import { Geocoder } from '../../services';
// import {
//   aLocation,
//   getProxiedGeoCoderConfig,
//   givenCachingProxy,
//   givenGame,
//   HttpCachingProxy,
//   isGeoCoderServiceAvailable,
// } from '../helpers';

// describe('GameApplication', () => {
//   let app: LeagueManagerApplication;
//   let client: Client;
//   let gameRepo: GameRepository;

//   let cachingProxy: HttpCachingProxy;
//   before(async () => (cachingProxy = await givenCachingProxy()));
//   after(() => cachingProxy.stop());

//   before(givenRunningApplicationWithCustomConfiguration);
//   after(() => app.stop());

//   let available = true;

//   before(async function (this: Mocha.Context) {
//     this.timeout(30 * 1000);
//     const service = await app.get<Geocoder>('services.Geocoder');
//     available = await isGeoCoderServiceAvailable(service);
//   });

//   before(givenGameRepository);
//   before(() => {
//     client = createRestAppClient(app);
//   });

//   beforeEach(async () => {
//     await gameRepo.deleteAll();
//   });

//   it('creates a game', async function (this: Mocha.Context) {
//     // Set timeout to 30 seconds as `post /games` triggers geocode look up
//     // over the internet and it takes more than 2 seconds
//     this.timeout(30000);
//     const game = givenGame();
//     const response = await client.post('/games').send(game).expect(200);
//     expect(response.body).to.containDeep(game);
//     const result = await gameRepo.findById(response.body.id);
//     expect(result).to.containDeep(game);
//   });

//   it('creates a game with arbitrary property', async function () {
//     const game = givenGame({ tag: { random: 'random' } });
//     const response = await client.post('/games').send(game).expect(200);
//     expect(response.body).to.containDeep(game);
//     const result = await gameRepo.findById(response.body.id);
//     expect(result).to.containDeep(game);
//   });

//   it('rejects requests to create a game with no title', async () => {
//     const game: Partial<Game> = givenGame();
//     delete game.title;
//     await client.post('/games').send(game).expect(422);
//   });

//   it('rejects requests with input that contains excluded properties', async () => {
//     const game = givenGame();
//     game.id = 1;
//     await client.post('/games').send(game).expect(422);
//   });

//   it('creates an address-based reminder', async function (this: Mocha.Context) {
//     if (!available) return this.skip();
//     // Increase the timeout to accommodate slow network connections
//     this.timeout(30000);

//     const game = givenGame({ remindAtAddress: aLocation.address });
//     const response = await client.post('/games').send(game).expect(200);
//     game.remindAtGeo = aLocation.geostring;

//     expect(response.body).to.containEql(game);

//     const result = await gameRepo.findById(response.body.id);
//     expect(result).to.containEql(game);
//   });

//   it('returns 400 if it cannot find an address', async function (this: Mocha.Context) {
//     if (!available) return this.skip();
//     // Increase the timeout to accommodate slow network connections
//     this.timeout(30000);

//     const game = givenGame({ remindAtAddress: 'this address does not exist' });
//     const response = await client.post('/games').send(game).expect(400);

//     expect(response.body.error.message).to.eql(
//       'Address not found: this address does not exist',
//     );
//   });

//   context('when dealing with a single persisted game', () => {
//     let persistedGame: Game;

//     beforeEach(async () => {
//       persistedGame = await givenGameInstance();
//     });

//     it('gets a game by ID', () => {
//       return client
//         .get(`/games/${persistedGame.id}`)
//         .send()
//         .expect(200, toJSON(persistedGame));
//     });

//     it('returns 404 when getting a game that does not exist', () => {
//       return client.get('/games/99999').expect(404);
//     });

//     it('replaces the game by ID', async () => {
//       const updatedGame = givenGame({
//         title: 'DO SOMETHING AWESOME',
//         desc: 'It has to be something ridiculous',
//         isComplete: true,
//       });
//       await client
//         .put(`/games/${persistedGame.id}`)
//         .send(updatedGame)
//         .expect(204);
//       const result = await gameRepo.findById(persistedGame.id);
//       expect(result).to.containEql(updatedGame);
//     });

//     it('returns 404 when replacing a game that does not exist', () => {
//       return client.put('/games/99999').send(givenGame()).expect(404);
//     });

//     it('updates the game by ID ', async () => {
//       const updatedGame = givenGame({
//         isComplete: true,
//       });
//       await client
//         .patch(`/games/${persistedGame.id}`)
//         .send(updatedGame)
//         .expect(204);
//       const result = await gameRepo.findById(persistedGame.id);
//       expect(result).to.containEql(updatedGame);
//     });

//     it('returns 404 when updating a game that does not exist', () => {
//       return client
//         .patch('/games/99999')
//         .send(givenGame({ isComplete: true }))
//         .expect(404);
//     });

//     it('deletes the game', async () => {
//       await client.del(`/games/${persistedGame.id}`).send().expect(204);
//       await expect(gameRepo.findById(persistedGame.id)).to.be.rejectedWith(
//         EntityNotFoundError,
//       );
//     });

//     it('returns 404 when deleting a game that does not exist', async () => {
//       await client.del(`/games/99999`).expect(404);
//     });

//     it('rejects request with invalid keys - constructor.prototype', async () => {
//       const res = await client
//         .get(
//           '/games?filter={"offset":0,"limit":100,"skip":0,' +
//           '"where":{"constructor.prototype":{"toString":"def"}},' +
//           '"fields":{"title":true,"id":true}}',
//         )
//         .expect(400);
//       expect(res.body?.error).to.containEql({
//         statusCode: 400,
//         name: 'BadRequestError',
//         code: 'INVALID_PARAMETER_VALUE',
//         details: {
//           syntaxError:
//             'JSON string cannot contain "constructor.prototype" key.',
//         },
//       });
//     });

//     it('rejects request with invalid keys - __proto__', async () => {
//       const res = await client
//         .get(
//           '/games?filter={"offset":0,"limit":100,"skip":0,' +
//           '"where":{"__proto__":{"toString":"def"}},' +
//           '"fields":{"title":true,"id":true}}',
//         )
//         .expect(400);
//       expect(res.body?.error).to.containEql({
//         statusCode: 400,
//         name: 'BadRequestError',
//         code: 'INVALID_PARAMETER_VALUE',
//         details: {
//           syntaxError: 'JSON string cannot contain "__proto__" key.',
//         },
//       });
//     });

//     it('rejects request with prohibited keys - badKey', async () => {
//       const res = await client
//         .get(
//           '/games?filter={"offset":0,"limit":100,"skip":0,' +
//           '"where":{"badKey":{"toString":"def"}},' +
//           '"fields":{"title":true,"id":true}}',
//         )
//         .expect(400);
//       expect(res.body?.error).to.containEql({
//         statusCode: 400,
//         name: 'BadRequestError',
//         code: 'INVALID_PARAMETER_VALUE',
//         details: {
//           syntaxError: 'JSON string cannot contain "badKey" key.',
//         },
//       });
//     });
//   });

//   context('allows logging to be reconfigured', () => {
//     it('logs http requests', async () => {
//       const logs: string[] = [];
//       const logToArray = (str: string) => {
//         logs.push(str);
//       };
//       app.configure<morgan.Options<Request, Response>>('middleware.morgan').to({
//         stream: {
//           write: logToArray,
//         },
//       });
//       await client.get('/games');
//       expect(logs.length).to.eql(1);
//       expect(logs[0]).to.match(/"GET \/games HTTP\/1\.1" 200 - "-"/);
//     });
//   });

//   it('queries games with a filter', async () => {
//     await givenGameInstance({ title: 'wake up', isComplete: true });

//     const gameInProgress = await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });

//     await client
//       .get('/games')
//       .query({ filter: { where: { isComplete: false } } })
//       .expect(200, [toJSON(gameInProgress)]);
//   });

//   it('exploded filter conditions work', async () => {
//     await givenGameInstance({ title: 'wake up', isComplete: true });
//     await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });

//     const response = await client.get('/games').query('filter[limit]=2');
//     expect(response.body).to.have.length(2);
//   });

//   it('queries games with string-based order filter', async () => {
//     const gameInProgress = await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });

//     const gameCompleted = await givenGameInstance({
//       title: 'wake up',
//       isComplete: true,
//     });

//     const gameCompleted2 = await givenGameInstance({
//       title: 'go to work',
//       isComplete: true,
//     });

//     await client
//       .get('/games')
//       .query({ filter: { order: 'title DESC' } })
//       .expect(200, toJSON([gameCompleted, gameCompleted2, gameInProgress]));
//   });

//   it('queries games with array-based order filter', async () => {
//     const gameInProgress = await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });

//     const gameCompleted = await givenGameInstance({
//       title: 'wake up',
//       isComplete: true,
//     });

//     const gameCompleted2 = await givenGameInstance({
//       title: 'go to work',
//       isComplete: true,
//     });

//     await client
//       .get('/games')
//       .query({ filter: { order: ['title DESC'] } })
//       .expect(200, toJSON([gameCompleted, gameCompleted2, gameInProgress]));
//   });

//   it('queries games with exploded string-based order filter', async () => {
//     const gameInProgress = await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });

//     const gameCompleted = await givenGameInstance({
//       title: 'wake up',
//       isComplete: true,
//     });

//     const gameCompleted2 = await givenGameInstance({
//       title: 'go to work',
//       isComplete: true,
//     });

//     await client
//       .get('/games')
//       .query('filter[order]=title%20DESC')
//       .expect(200, [
//         toJSON(gameCompleted),
//         toJSON(gameCompleted2),
//         toJSON(gameInProgress),
//       ]);
//   });

//   it('queries games with exploded array-based fields filter', async () => {
//     await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });
//     await client
//       .get('/games')
//       .query('filter[fields][0]=title')
//       .expect(200, toJSON([{ title: 'go to sleep' }]));
//   });

//   it('queries games with exploded array-based order filter', async () => {
//     const gameInProgress = await givenGameInstance({
//       title: 'go to sleep',
//       isComplete: false,
//     });

//     const gameCompleted = await givenGameInstance({
//       title: 'wake up',
//       isComplete: true,
//     });

//     const gameCompleted2 = await givenGameInstance({
//       title: 'go to work',
//       isComplete: true,
//     });

//     await client
//       .get('/games')
//       .query('filter[order][0]=title+DESC')
//       .expect(200, toJSON([gameCompleted, gameCompleted2, gameInProgress]));
//   });

//   /*
//    ============================================================================
//    TEST HELPERS
//    These functions help simplify setup of your test fixtures so that your tests
//    can:
//    - operate on a "clean" environment each time (a fresh in-memory database)
//    - avoid polluting the test with large quantities of setup logic to keep
//    them clear and easy to read
//    - keep them DRY (who wants to write the same stuff over and over?)
//    ============================================================================
//    */

//   async function givenRunningApplicationWithCustomConfiguration() {
//     app = new LeagueManagerApplication({
//       rest: givenHttpServerConfig(),
//     });

//     app.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
//       validation: {
//         prohibitedKeys: ['badKey'],
//       },
//     });

//     await app.boot();

//     /**
//      * Override default config for DataSource for testing so we don't write
//      * test data to file when using the memory connector.
//      */
//     app.bind('datasources.config.db').to({
//       name: 'db',
//       connector: 'memory',
//     });

//     // Override Geocoder datasource to use a caching proxy to speed up tests.
//     app
//       .bind('datasources.config.geocoder')
//       .to(getProxiedGeoCoderConfig(cachingProxy));

//     // Start Application
//     await app.start();
//   }

//   async function givenGameRepository() {
//     gameRepo = await app.getRepository(GameRepository);
//   }

//   async function givenGameInstance(game?: Partial<Game>) {
//     return gameRepo.create(givenGame(game));
//   }
// });
