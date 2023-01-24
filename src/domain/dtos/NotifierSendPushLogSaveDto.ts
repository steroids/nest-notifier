import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierSendPushLogModel} from '../models/NotifierSendPushLogModel';

export class NotifierSendPushLogSaveDto {
    @ExtendField(NotifierSendPushLogModel)
    id: number;

    @ExtendField(NotifierSendPushLogModel)
    sendLogId: number;

    @ExtendField(NotifierSendPushLogModel)
    messageId: string;

    @ExtendField(NotifierSendPushLogModel)
    errorCode: string;

    @ExtendField(NotifierSendPushLogModel)
    errorMessage: string;
}
