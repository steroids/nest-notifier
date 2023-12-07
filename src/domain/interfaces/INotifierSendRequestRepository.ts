import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierSendRequestModel} from '../models/NotifierSendRequestModel';

export const INotifierSendRequestRepository = 'INotifierSendRequestRepository';

export type INotifierSendRequestRepository = ICrudRepository<NotifierSendRequestModel>
