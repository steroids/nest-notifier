import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierSendPushLogModel} from '../models/NotifierSendPushLogModel';

export const INotifierSendPushLogRepository = 'INotifierSendPushLogRepository';

export type INotifierSendPushLogRepository = ICrudRepository<NotifierSendPushLogModel>
