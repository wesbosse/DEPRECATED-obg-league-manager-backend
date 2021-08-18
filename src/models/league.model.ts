import { Entity, model, property } from '@loopback/repository';

@model()
export class League extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true
  })
  manager?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'number',
    default: 0.00,
  })
  entryFee?: number;

  @property({
    type: 'number',
  })
  pointsPerGame?: number;

  @property({
    type: 'number',
  })
  rounds?: number;

  @property({
    type: 'object',
  })
  missionInfo?: object;

  @property({
    type: 'object',
  })
  details?: object;

  @property({
    type: 'object',
  })
  dates?: object;

  @property({
    type: 'object',
  })
  pods?: object;


  constructor(data?: Partial<League>) {
    super(data);
  }
}

export interface LeagueRelations {
  // describe navigational properties here
}

export type LeagueWithRelations = League & LeagueRelations;
