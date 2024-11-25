import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {NotifierSendPushLogModel} from '../../domain/models/NotifierSendPushLogModel';

@TableFromModel(NotifierSendPushLogModel, 'notifier_send_push_log')
export class NotifierSendPushLogTable extends NotifierSendPushLogModel {}
