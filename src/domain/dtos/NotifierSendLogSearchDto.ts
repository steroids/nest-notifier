import {SearchInputDto} from '@steroidsjs/nest/usecases/dtos/SearchInputDto';
import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierSendLogModel} from '../models/NotifierSendLogModel';

export class NotifierSendLogSearchDto extends SearchInputDto {
    @ExtendField(NotifierSendLogModel)
    id: number;

    @ExtendField(NotifierSendLogModel)
    sendRequestId: number;

    @ExtendField(NotifierSendLogModel)
    providerType: string;

    @ExtendField(NotifierSendLogModel)
    providerName: string;

    @ExtendField(NotifierSendLogModel)
    status: string;

    @ExtendField(NotifierSendLogModel)
    receiver: string;

    @ExtendField(NotifierSendLogModel)
    errorMessage?: string;
}
