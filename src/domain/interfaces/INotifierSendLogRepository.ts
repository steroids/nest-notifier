import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierSendLogModel} from '../models/NotifierSendLogModel';

export const INotifierSendLogRepository = 'INotifierSendLogRepository';

export type INotifierSendLogRepository = ICrudRepository<NotifierSendLogModel>
