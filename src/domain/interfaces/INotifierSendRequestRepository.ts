import {ICrudRepository} from '@steroidsjs/nest/usecases/interfaces/ICrudRepository';
import {NotifierSendRequestModel} from '../models/NotifierSendRequestModel';

export const INotifierSendRequestRepository = 'INotifierSendRequestRepository';

export interface INotifierSendRequestRepository extends ICrudRepository<NotifierSendRequestModel> {
    isDbTransactionActive(): boolean,
}
