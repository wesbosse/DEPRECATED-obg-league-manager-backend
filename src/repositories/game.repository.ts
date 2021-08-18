// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Game, GameRelations } from '../models';

export class GameRepository extends DefaultCrudRepository<
  Game,
  typeof Game.prototype.id,
  GameRelations
  > {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Game, dataSource);
  }
}
