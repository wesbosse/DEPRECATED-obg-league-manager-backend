// Copyright IBM Corp. 2019,2020 All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import { LeagueManagerApplication } from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new LeagueManagerApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return { app, client };
}

export interface AppWithClient {
  app: LeagueManagerApplication;
  client: Client;
}
