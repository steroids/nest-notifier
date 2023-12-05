import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {NotifierStoreMessageModel} from '../models/NotifierStoreMessageModel';
import NotifierStoreMessageSearchDto from '../dtos/NotifierStoreMessageSearchDto';
import {NotifierStoreMessageSaveDto} from '../dtos/NotifierStoreMessageSaveDto';
import {INotifierStoreMessageRepository} from '../interfaces/INotifierStoreMessageRepository';

export default class NotifierStoreService extends CrudService<NotifierStoreMessageModel,
    NotifierStoreMessageSearchDto,
    NotifierStoreMessageSaveDto> {
    protected modelClass = NotifierStoreMessageModel;

    constructor(
        /** @see NotifierStoreMessageRepository  */
        public repository: INotifierStoreMessageRepository,
    ) {
        super();
    }

    public async readNotification(notificationId: number) {
        return this.repository.readNotifications([notificationId]);
    }

    public async readNotifications(notificationsIds: number[]) {
        return this.repository.readNotifications(notificationsIds);
    }
}
