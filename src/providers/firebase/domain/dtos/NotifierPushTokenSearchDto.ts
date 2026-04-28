import {SearchInputDto} from '@steroidsjs/nest/usecases/dtos/SearchInputDto';
import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierPushTokenModel} from '../models/NotifierPushTokenModel';

export class NotifierPushTokenSearchDto extends SearchInputDto {
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
