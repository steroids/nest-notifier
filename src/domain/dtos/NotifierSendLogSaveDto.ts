import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierSendLogModel} from '../models/NotifierSendLogModel';

export class NotifierSendLogSaveDto {
    @ExtendField(NotifierSendLogModel)
    id: number;

    @ExtendField(NotifierSendLogModel)
    provider: string;

    @ExtendField(NotifierSendLogModel)
    status: string;
}
