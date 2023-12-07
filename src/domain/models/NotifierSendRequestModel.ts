import {PrimaryKeyField, RelationField} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {NotifierSendLogModel} from './NotifierSendLogModel';

/*
    Запрос на отправку уведомления через различных провайдеров
 */
export class NotifierSendRequestModel {
    @PrimaryKeyField({
        label: 'Первичный ключ',
    })
    id: number;

    @RelationField({
        label: 'Логи отправки уведомления через различных провайдеров',
        type: 'OneToMany',
        relationClass: () => NotifierSendLogModel,
        inverseSide: (log: NotifierSendLogModel) => log.sendRequest,
    })
    logs: NotifierSendLogModel[];
}
