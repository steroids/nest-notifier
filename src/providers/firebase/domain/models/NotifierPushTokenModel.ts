import {
    CreateTimeField,
    EnumField,
    PrimaryKeyField,
    StringField,
    UpdateTimeField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {NotifierPushTokenPlatformEnum} from '../enums/NotifierPushTokenPlatformEnum';

/*
    Device token для push-уведомлений.
*/
export class NotifierPushTokenModel {
    @PrimaryKeyField({
        label: 'Первичный ключ',
    })
    id: number;

    @StringField({
        label: 'Внешний ID пользователя',
    })
    userId: string;

    @StringField({
        label: 'Device token',
    })
    token: string;

    @EnumField({
        label: 'Платформа устройства',
        enum: NotifierPushTokenPlatformEnum,
        nullable: true,
    })
    platform: string;

    @StringField({
        label: 'Название push-провайдера',
        nullable: true,
    })
    providerName: string;

    @CreateTimeField({
        label: 'Время создания',
    })
    createTime: string;

    @UpdateTimeField({
        label: 'Время обновления',
    })
    updateTime: string;
}
