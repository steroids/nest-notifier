import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierStoreMessageModel} from '../models/NotifierStoreMessageModel';

export const INotifierStoreMessageRepository = 'INotifierStoreMessageRepository';
export type INotifierStoreMessageRepository = ICrudRepository<NotifierStoreMessageModel>;
