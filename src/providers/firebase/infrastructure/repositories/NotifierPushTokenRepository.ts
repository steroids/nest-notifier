import {Repository} from '@steroidsjs/typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {NotifierPushTokenModel} from '../../domain/models/NotifierPushTokenModel';
import {NotifierPushTokenTable} from '../tables/NotifierPushTokenTable';

@Injectable()
export class NotifierPushTokenRepository extends CrudRepository<NotifierPushTokenModel> {
    constructor(
        @InjectRepository(NotifierPushTokenTable)
        public dbRepository: Repository<NotifierPushTokenTable>,
    ) {
        super();
    }

    protected modelClass = NotifierPushTokenModel;
}
