// // Copyright IBM Corp. 2019,2020. All Rights Reserved.
// // Node module: @loopback/example-todo
// // This file is licensed under the MIT License.
// // License text available at https://opensource.org/licenses/MIT

// import { Filter } from '@loopback/repository';
// import {
//   createStubInstance,
//   expect,
//   sinon,
//   StubbedInstanceWithSinonAccessor,
// } from '@loopback/testlab';
// import { GameController } from '../../../controllers';
// import { Game } from '../../../models/index';
// import { GameRepository } from '../../../repositories';
// import { Geocoder } from '../../../services';
// import { aLocation, givenGame } from '../../helpers';

// describe('GameController', () => {
//   let gameRepo: StubbedInstanceWithSinonAccessor<GameRepository>;
//   let geoService: Geocoder;

//   let geocode: sinon.SinonStub;

//   /*
//   =============================================================================
//   TEST VARIABLES
//   Combining top-level objects with our resetRepositories method means we don't
//   need to duplicate several variable assignments (and generation statements)
//   in all of our test logic.

//   NOTE: If you wanted to parallelize your test runs, you should avoid this
//   pattern since each of these tests is sharing references.
//   =============================================================================
//   */
//   let controller: GameController;
//   let aGame: Game;
//   let aGameWithId: Game;
//   let aChangedGame: Game;
//   let aListOfGames: Game[];

//   beforeEach(resetRepositories);

//   describe('createGame', () => {
//     it('creates a Game', async () => {
//       const create = gameRepo.stubs.create;
//       create.resolves(aGameWithId);
//       const result = await controller.create(aGame);
//       expect(result).to.eql(aGameWithId);
//       sinon.assert.calledWith(create, aGame);
//     });

//     it('resolves remindAtAddress to a geocode', async () => {
//       const create = gameRepo.stubs.create;
//       geocode.resolves([aLocation.geopoint]);

//       const input = givenGame({ remindAtAddress: aLocation.address });

//       const expected = new Game(input);
//       Object.assign(expected, {
//         remindAtAddress: aLocation.address,
//         remindAtGeo: aLocation.geostring,
//       });
//       create.resolves(expected);

//       const result = await controller.create(input);

//       expect(result).to.eql(expected);
//       sinon.assert.calledWith(create, input);
//       sinon.assert.calledWith(geocode, input.remindAtAddress);
//     });
//   });

//   describe('findGameById', () => {
//     it('returns a game if it exists', async () => {
//       const findById = gameRepo.stubs.findById;
//       findById.resolves(aGameWithId);
//       expect(await controller.findById(aGameWithId.id as number)).to.eql(
//         aGameWithId,
//       );
//       sinon.assert.calledWith(findById, aGameWithId.id);
//     });
//   });

//   describe('findGames', () => {
//     it('returns multiple games if they exist', async () => {
//       const find = gameRepo.stubs.find;
//       find.resolves(aListOfGames);
//       expect(await controller.find()).to.eql(aListOfGames);
//       sinon.assert.called(find);
//     });

//     it('returns empty list if no games exist', async () => {
//       const find = gameRepo.stubs.find;
//       const expected: Game[] = [];
//       find.resolves(expected);
//       expect(await controller.find()).to.eql(expected);
//       sinon.assert.called(find);
//     });

//     it('uses the provided filter', async () => {
//       const find = gameRepo.stubs.find;
//       const filter: Filter<Game> = { where: { isComplete: false } };

//       find.resolves(aListOfGames);
//       await controller.find(filter);
//       sinon.assert.calledWith(find, filter);
//     });
//   });

//   describe('replaceGame', () => {
//     it('successfully replaces existing items', async () => {
//       const replaceById = gameRepo.stubs.replaceById;
//       replaceById.resolves();
//       await controller.replaceById(aGameWithId.id as number, aChangedGame);
//       sinon.assert.calledWith(replaceById, aGameWithId.id, aChangedGame);
//     });
//   });

//   describe('updateGame', () => {
//     it('successfully updates existing items', async () => {
//       const updateById = gameRepo.stubs.updateById;
//       updateById.resolves();
//       await controller.updateById(aGameWithId.id as number, aChangedGame);
//       sinon.assert.calledWith(updateById, aGameWithId.id, aChangedGame);
//     });
//   });

//   describe('deleteGame', () => {
//     it('successfully deletes existing items', async () => {
//       const deleteById = gameRepo.stubs.deleteById;
//       deleteById.resolves();
//       await controller.deleteById(aGameWithId.id as number);
//       sinon.assert.calledWith(deleteById, aGameWithId.id);
//     });
//   });

//   function resetRepositories() {
//     gameRepo = createStubInstance(GameRepository);
//     aGame = givenGame();
//     aGameWithId = givenGame({
//       id: 1,
//     });
//     aListOfGames = [
//       aGameWithId,
//       givenGame({
//         id: 2,
//         title: 'so many things to do',
//       }),
//     ] as Game[];
//     aChangedGame = givenGame({
//       id: aGameWithId.id,
//       title: 'Do some important things',
//     });

//     geoService = { geocode: sinon.stub() };
//     geocode = geoService.geocode as sinon.SinonStub;

//     controller = new GameController(gameRepo, geoService);
//   }
// });
