import {Repository} from '@steroidsjs/typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {NotifierStoreMessageModel} from '../../domain/models/NotifierStoreMessageModel';
import {NotifierStoreMessageTable} from '../tables/NotifierStoreMessageTable';

@Injectable()
export class NotifierStoreMessageRepository extends CrudRepository<NotifierStoreMessageModel> {
    protected modelClass = NotifierStoreMessageModel;

    constructor(
        @InjectRepository(NotifierStoreMessageTable)
        public dbRepository: Repository<NotifierStoreMessageTable>,
    ) {
        super();
    }
}
