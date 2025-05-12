import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {NotifierSendLogModel} from '../../domain/models/NotifierSendLogModel';

@TypeOrmTableFromModel(NotifierSendLogModel, 'notifier_send_log')
export class NotifierSendLogTable implements IDeepPartial<NotifierSendLogModel> {}
