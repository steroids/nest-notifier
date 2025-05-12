import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {NotifierSendPushLogModel} from '../../domain/models/NotifierSendPushLogModel';

@TypeOrmTableFromModel(NotifierSendPushLogModel, 'notifier_send_push_log')
export class NotifierSendPushLogTable implements IDeepPartial<NotifierSendPushLogModel> {}
