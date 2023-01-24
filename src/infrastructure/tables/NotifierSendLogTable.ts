import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {NotifierSendLogModel} from '../../domain/models/NotifierSendLogModel';

@TableFromModel(NotifierSendLogModel, 'notifier_send_log')
export class NotifierSendLogTable implements IDeepPartial<NotifierSendLogModel> {}
