import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierStoreMessageModel} from '../models/NotifierStoreMessageModel';

export const INotifierStoreMessageRepository = 'INotifierStoreMessageRepository';
export interface INotifierStoreMessageRepository extends ICrudRepository<NotifierStoreMessageModel> {
    readNotifications: (notificationsIds: number[]) => Promise<void>;
}
