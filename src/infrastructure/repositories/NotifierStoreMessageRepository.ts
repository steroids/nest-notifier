import {Repository} from '@steroidsjs/typeorm';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@steroidsjs/nest-typeorm';
import {CrudRepository} from '@steroidsjs/nest/infrastructure/repositories/CrudRepository';
import {NotifierStoreMessageModel} from '../../domain/models/NotifierStoreMessageModel';
import {NotifierStoreMessageTable} from '../tables/NotifierStoreMessageTable';
import {INotifierStoreMessageRepository} from '../../domain/interfaces/INotifierStoreMessageRepository';

@Injectable()
export class NotifierStoreMessageRepository
    extends CrudRepository<NotifierStoreMessageModel>
    implements INotifierStoreMessageRepository {
    protected modelClass = NotifierStoreMessageModel;

    constructor(
        @InjectRepository(NotifierStoreMessageTable)
        public dbRepository: Repository<NotifierStoreMessageTable>,
    ) {
        super();
    }

    public async readNotifications(notificationsIds: number[]) {
        await this.dbRepository.createQueryBuilder()
            .update()
            .set({isRead: true})
            .where('id IN (:...notificationsIds)', {notificationsIds})
            .execute()
        return;
    }
}
