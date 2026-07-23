import {Repository} from 'typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {NotifierSendRequestModel} from '../../domain/models/NotifierSendRequestModel';
import {NotifierSendRequestTable} from '../tables/NotifierSendRequestTable';

@Injectable()
export class NotifierSendRequestRepository extends CrudRepository<NotifierSendRequestModel> {
    constructor(
        @InjectRepository(NotifierSendRequestTable)
        public dbRepository: Repository<NotifierSendRequestTable>,
    ) {
        super();
    }

    protected modelClass = NotifierSendRequestModel;

    public isDbTransactionActive(): boolean {
        return !!this.dbRepository.manager.queryRunner?.isTransactionActive;
    }
}
