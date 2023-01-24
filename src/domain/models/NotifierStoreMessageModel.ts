import {
    PrimaryKeyField,
    StringField,
    BooleanField,
    CreateTimeField, IntegerField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';

/**
 * Уведомление
 */
export class NotifierStoreMessageModel {
    @PrimaryKeyField()
    id: number;

    @IntegerField({
        label: 'ID основной связанной сущности',
        nullable: true,
    })
    refId: number;

    @StringField({
        label: 'Шаблон',
        nullable: true,
    })
    templateName: string;

    @StringField({
        label: 'Параметры шаблона',
        nullable: true,
    })
    templateParams: string;

    @StringField({
        label: 'Сообщение',
    })
    content: string;

    @BooleanField({
        label: 'Прочитано пользователем?',
    })
    isRead: string;

    @IntegerField({
        label: 'ID получателя',
    })
    receiverId: number;

    @CreateTimeField({
        label: 'Создан',
    })
    createTime: string;
}
