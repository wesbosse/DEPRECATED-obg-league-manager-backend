import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {League} from '../models';
import {LeagueRepository} from '../repositories';

export class LeagueController {
  constructor(
    @repository(LeagueRepository)
    public leagueRepository : LeagueRepository,
  ) {}

  @post('/leagues')
  @response(200, {
    description: 'League model instance',
    content: {'application/json': {schema: getModelSchemaRef(League)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(League, {
            title: 'NewLeague',
            exclude: ['id'],
          }),
        },
      },
    })
    league: Omit<League, 'id'>,
  ): Promise<League> {
    return this.leagueRepository.create(league);
  }

  @get('/leagues/count')
  @response(200, {
    description: 'League model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(League) where?: Where<League>,
  ): Promise<Count> {
    return this.leagueRepository.count(where);
  }

  @get('/leagues')
  @response(200, {
    description: 'Array of League model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(League, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(League) filter?: Filter<League>,
  ): Promise<League[]> {
    return this.leagueRepository.find(filter);
  }

  @patch('/leagues')
  @response(200, {
    description: 'League PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(League, {partial: true}),
        },
      },
    })
    league: League,
    @param.where(League) where?: Where<League>,
  ): Promise<Count> {
    return this.leagueRepository.updateAll(league, where);
  }

  @get('/leagues/{id}')
  @response(200, {
    description: 'League model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(League, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(League, {exclude: 'where'}) filter?: FilterExcludingWhere<League>
  ): Promise<League> {
    return this.leagueRepository.findById(id, filter);
  }

  @patch('/leagues/{id}')
  @response(204, {
    description: 'League PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(League, {partial: true}),
        },
      },
    })
    league: League,
  ): Promise<void> {
    await this.leagueRepository.updateById(id, league);
  }

  @put('/leagues/{id}')
  @response(204, {
    description: 'League PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() league: League,
  ): Promise<void> {
    await this.leagueRepository.replaceById(id, league);
  }

  @del('/leagues/{id}')
  @response(204, {
    description: 'League DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.leagueRepository.deleteById(id);
  }
}
