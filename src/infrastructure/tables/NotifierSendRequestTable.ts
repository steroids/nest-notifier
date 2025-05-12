import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {NotifierSendRequestModel} from '../../domain/models/NotifierSendRequestModel';

@TypeOrmTableFromModel(NotifierSendRequestModel, 'notifier_send_request')
export class NotifierSendRequestTable implements IDeepPartial<NotifierSendRequestModel> {}
