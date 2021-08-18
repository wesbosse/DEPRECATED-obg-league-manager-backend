import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {League, LeagueRelations} from '../models';

export class LeagueRepository extends DefaultCrudRepository<
  League,
  typeof League.prototype.id,
  LeagueRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(League, dataSource);
  }
}
