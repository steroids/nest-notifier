import BaseEnum from '@steroidsjs/nest/domain/base/BaseEnum';

export class NotifierStatusEnum extends BaseEnum {
    static SENT = 'sent';

    static ERROR = 'error';

    static DELIVERED = 'delivered';

    static getLabels() {
        return {
            [this.DELIVERED]: 'Доставлено',
            [this.ERROR]: 'Ошибка отправки',
            [this.SENT]: 'Отправлено',
        };
    }
}
