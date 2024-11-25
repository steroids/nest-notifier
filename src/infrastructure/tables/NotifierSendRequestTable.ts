import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {NotifierSendRequestModel} from '../../domain/models/NotifierSendRequestModel';

@TableFromModel(NotifierSendRequestModel, 'notifier_send_request')
export class NotifierSendRequestTable extends NotifierSendRequestModel {}
