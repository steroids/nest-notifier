import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierPushTokenModel} from '../models/NotifierPushTokenModel';

export class NotifierPushTokenSaveDto {
    @ExtendField(NotifierPushTokenModel)
    id: number;

    @ExtendField(NotifierPushTokenModel)
    userId: string;

    @ExtendField(NotifierPushTokenModel)
    token: string;

    @ExtendField(NotifierPushTokenModel)
    platform: string;

    @ExtendField(NotifierPushTokenModel)
    providerName: string;
}
