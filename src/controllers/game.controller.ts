// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import { Game } from '../models';
import { GameRepository } from '../repositories';
import { Geocoder } from '../services';
import { authenticate } from '@loopback/authentication';

@authenticate('jwt')
export class GameController {
  constructor(
    @repository(GameRepository)
    public gameRepository: GameRepository,
    @inject('services.Geocoder') protected geoService: Geocoder,
  ) { }

  @post('/games', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Game) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, {
            title: 'NewGame',
            exclude: ['id'],
          }),
        },
      },
    })
    game: Omit<Game, 'id'>,
  ): Promise<Game> {
    return this.gameRepository.create(game);
  }

  @get('/games/{id}', {
    responses: {
      '200': {
        description: 'Game model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Game, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Game, { exclude: 'where' }) filter?: FilterExcludingWhere<Game>,
  ): Promise<Game> {
    return this.gameRepository.findById(id, filter);
  }

  @get('/games', {
    responses: {
      '200': {
        description: 'Array of Game model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Game, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Game) filter?: Filter<Game>): Promise<Game[]> {
    return this.gameRepository.find(filter);
  }

  @put('/games/{id}', {
    responses: {
      '204': {
        description: 'Game PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() game: Game,
  ): Promise<void> {
    await this.gameRepository.replaceById(id, game);
  }

  @patch('/games/{id}', {
    responses: {
      '204': {
        description: 'Game PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, { partial: true }),
        },
      },
    })
    game: Game,
  ): Promise<void> {
    await this.gameRepository.updateById(id, game);
  }

  @del('/games/{id}', {
    responses: {
      '204': {
        description: 'Game DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.gameRepository.deleteById(id);
  }

  @get('/games/count', {
    responses: {
      '200': {
        description: 'Game model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(@param.where(Game) where?: Where<Game>): Promise<Count> {
    return this.gameRepository.count(where);
  }

  @patch('/games', {
    responses: {
      '200': {
        description: 'Game PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Game, { partial: true }),
        },
      },
    })
    game: Game,
    @param.where(Game) where?: Where<Game>,
  ): Promise<Count> {
    return this.gameRepository.updateAll(game, where);
  }
}
