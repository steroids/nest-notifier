import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {NotifierSendLogModel} from '../../domain/models/NotifierSendLogModel';

@TableFromModel(NotifierSendLogModel, 'notifier_send_log')
export class NotifierSendLogTable extends NotifierSendLogModel {}
