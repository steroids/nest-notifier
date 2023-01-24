import {ExtendField} from '@steroidsjs/nest/infrastructure/decorators/fields/ExtendField';
import {NotifierStoreMessageModel} from '../models/NotifierStoreMessageModel';

export class NotifierStoreMessageSaveDto {
    @ExtendField(NotifierStoreMessageModel, {
        required: true,
    })
    refId: number;

    @ExtendField(NotifierStoreMessageModel, {
        required: true,
    })
    content: string;

    @ExtendField(NotifierStoreMessageModel)
    templateName: string;

    @ExtendField(NotifierStoreMessageModel)
    templateParams: string;

    @ExtendField(NotifierStoreMessageModel, {
        required: true,
    })
    receiverId: number;
}
