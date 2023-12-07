import {
    CreateTimeField,
    EnumField,
    PrimaryKeyField,
    RelationField, RelationIdField, StringField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';
import {NotifierSendPushLogModel} from './NotifierSendPushLogModel';
import {NotifierSendRequestModel} from './NotifierSendRequestModel';

/*
   Лог отправки уведомления
*/
export class NotifierSendLogModel {
    @PrimaryKeyField({
        label: 'Первичный ключ',
    })
    id: number;

    @EnumField({
        label: 'Тип провайдера (SMS, PUSH и т.д.)',
        enum: NotifierProviderType,
    })
    providerType: string;

    @StringField({
        label: 'Название провайдера',
    })
    providerName: string;

    @EnumField({
        label: 'Статус отправки',
        enum: NotifierStatusEnum,
    })
    status: string;

    @StringField({
        label: 'Текст ошибки',
        nullable: true,
    })
    errorMessage: string;

    @StringField({
        label: 'Получатель уведомления',
    })
    receiver: string;

    @RelationField({
        label: 'Запрос на отправку',
        type: 'ManyToOne',
        relationClass: () => NotifierSendRequestModel,
    })
    sendRequest: NotifierSendRequestModel;

    @RelationIdField({
        relationName: 'sendRequest',
    })
    sendRequestId: number;

    @RelationField({
        label: 'Детальный лог отправки push-уведомления',
        type: 'OneToOne',
        isOwningSide: false,
        inverseSide: (log: NotifierSendPushLogModel) => log.sendLog,
        relationClass: () => NotifierSendPushLogModel,
    })
    sendPushLog: NotifierSendPushLogModel;

    @CreateTimeField({
        label: 'Время создания',
    })
    createTime: string;
}
