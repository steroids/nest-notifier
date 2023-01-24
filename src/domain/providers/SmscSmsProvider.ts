import {ConfigService} from '@nestjs/config';
import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierSmsOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';

export class SmscSmsProvider implements INotifierProvider {
    public type = NotifierProviderType.SMS;

    public name = 'smsc';

    constructor(
        public configService: ConfigService,
    ) {
    }

    async send(options: INotifierSmsOptions & INotifierBaseOptions) {
        let phone = options.phone;
        phone = phone.replace('/[^0-9]+/', '');
        phone = phone.replace('/^8/', '7');

        const login = this.configService.get('notifier.providers.smsc.login');
        const psw = this.configService.get('notifier.providers.smsc.password');

        if (!login) {
            throw new Error('Wrong SmscSmsProvider configuration, please set "notifier.providers.smsc.login" param.');
        }

        if (!psw) {
            throw new Error(
                'Wrong SmscSmsProvider configuration, please set "notifier.providers.smsc.password" param.',
            );
        }

        let response;
        try {
            response = await axios.get('https://smsc.ru/sys/send.php', {
                params: {
                    login,
                    psw,
                    phones: phone,
                    mes: options.message,
                    sender: options.sender,
                    fmt: 3,
                    op: 1,
                },
            });
        } catch (e) {
            throw new NotifierSendException(JSON.stringify(e));
        }

        Object.values(response.data.phones as Array<any>).forEach(
            (sending) => {
                if (Number(sending.status)) {
                    throw new NotifierSendException(
                        `status ${sending.status}, phone ${sending.phone}, text ${sending.error}`,
                    );
                }
            },
        );
    }
}
