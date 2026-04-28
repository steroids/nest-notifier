import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import {TypeOrmTableFromModel} from '@steroidsjs/nest/infrastructure/decorators/typeorm/TypeOrmTableFromModel';
import {NotifierPushTokenModel} from '../../domain/models/NotifierPushTokenModel';

@TypeOrmTableFromModel(NotifierPushTokenModel, 'notifier_push_token')
export class NotifierPushTokenTable implements IDeepPartial<NotifierPushTokenModel> {}
