import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {NotifierSendPushLogModel} from '../../domain/models/NotifierSendPushLogModel';
import {NotifierSendPushLogTable} from '../tables/NotifierSendPushLogTable';

@Injectable()
export class NotifierSendPushLogRepository extends CrudRepository<NotifierSendPushLogModel> {
    constructor(
        @InjectRepository(NotifierSendPushLogTable)
        public dbRepository: Repository<NotifierSendPushLogTable>,
    ) {
        super();
    }

    protected modelClass = NotifierSendPushLogModel;
}
