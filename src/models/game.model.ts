// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity, model, property } from '@loopback/repository';

@model()
export class Game extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  player1: number;

  @property({
    type: 'number',
    required: true,
  })
  player2: number;

  @property({
    type: 'boolean',
    default: false
  })
  ringer?: boolean;

  constructor(data?: Partial<Game>) {
    super(data);
  }
}

export interface GameRelations {
  // describe navigational properties here
}

export type GameWithRelations = Game & GameRelations;
