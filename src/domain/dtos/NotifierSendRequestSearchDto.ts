import {SearchInputDto} from '@steroidsjs/nest/usecases/dtos/SearchInputDto';
import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierSendRequestModel} from '../models/NotifierSendRequestModel';

export class NotifierSendRequestSearchDto extends SearchInputDto {
    @ExtendField(NotifierSendRequestModel)
    id: number;
}
