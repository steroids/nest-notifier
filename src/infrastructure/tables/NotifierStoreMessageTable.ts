import {TableFromModel} from '@steroidsjs/nest/infrastructure/decorators/TableFromModel';
import {IDeepPartial} from '@steroidsjs/nest/usecases/interfaces/IDeepPartial';
import { NotifierStoreMessageModel } from '../../domain/models/NotifierStoreMessageModel';

@TableFromModel(NotifierStoreMessageModel, 'notifier_message')
export class NotifierStoreMessageTable implements IDeepPartial<NotifierStoreMessageModel> {}
