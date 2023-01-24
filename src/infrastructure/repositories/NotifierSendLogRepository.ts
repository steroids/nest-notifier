import {Repository} from '@steroidsjs/typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {NotifierSendLogModel} from '../../domain/models/NotifierSendLogModel';
import {NotifierSendLogTable} from '../tables/NotifierSendLogTable';

@Injectable()
export class NotifierSendLogRepository extends CrudRepository<NotifierSendLogModel> {
    constructor(
        @InjectRepository(NotifierSendLogTable)
        public dbRepository: Repository<NotifierSendLogTable>,
    ) {
        super();
    }

    protected modelClass = NotifierSendLogModel;
}
