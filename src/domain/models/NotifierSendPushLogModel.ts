import {
    PrimaryKeyField,
    RelationField,
    RelationIdField,
    StringField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {NotifierSendLogModel} from './NotifierSendLogModel';

/*
    Детальный лог отправки push-уведомления
*/
export class NotifierSendPushLogModel {
    @PrimaryKeyField({
        label: 'Первичный ключ',
    })
    id: number;

    @RelationField({
        label: 'Основной лог отправки уведомления',
        type: 'OneToOne',
        isOwningSide: true,
        relationClass: () => NotifierSendLogModel,
    })
    sendLog: NotifierSendLogModel;

    @RelationIdField({
        relationName: 'sendLog',
    })
    sendLogId: number;

    @StringField({
        label: 'Внешний ID сообщения провайдера (Firebase messageId)',
        nullable: true,
    })
    messageId: string;

    @StringField({
        label: 'Код ошибки',
        nullable: true,
    })
    errorCode: string;

    @StringField({
        label: 'Описание ошибки',
        nullable: true,
    })
    errorMessage: string;
}
