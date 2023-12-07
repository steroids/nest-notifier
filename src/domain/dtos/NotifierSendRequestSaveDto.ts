import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierSendRequestModel} from '../models/NotifierSendRequestModel';

export class NotifierSendRequestSaveDto {
    @ExtendField(NotifierSendRequestModel)
    id: number;
}
