import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierPushTokenModel} from '../models/NotifierPushTokenModel';

export const INotifierPushTokenRepository = 'INotifierPushTokenRepository';

export type INotifierPushTokenRepository = ICrudRepository<NotifierPushTokenModel>
