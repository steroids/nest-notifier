import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {NotifierSendPushLogModel} from '../../domain/models/NotifierSendPushLogModel';

@TableFromModel(NotifierSendPushLogModel, 'notifier_send_push_log')
export class NotifierSendPushLogTable implements IDeepPartial<NotifierSendPushLogModel> {}
