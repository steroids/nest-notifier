import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {NotifierSendRequestModel} from '../../domain/models/NotifierSendRequestModel';

@TableFromModel(NotifierSendRequestModel, 'notifier_send_request')
export class NotifierSendRequestTable implements IDeepPartial<NotifierSendRequestModel> {}
