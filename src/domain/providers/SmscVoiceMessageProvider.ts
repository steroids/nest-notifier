import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierVoiceMessageOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';

export class SmscVoiceMessageProvider implements INotifierProvider {
    public type = NotifierProviderType.VOICE;

    public name = 'smsc';

    constructor(
        public configService: ConfigService,
    ) {
    }

    async send(options: INotifierVoiceMessageOptions & INotifierBaseOptions) {
        let phone = options.phone;
        phone = phone.replace('/[^0-9]+/', '');
        phone = phone.replace('/^8/', '7');

        const login = this.configService.get('notifier.providers.smsc.login');
        const psw = this.configService.get('notifier.providers.smsc.password');

        if (!login) {
            throw new Error('Wrong SmscCallProvider configuration, please set "notifier.providers.smsc.login" param.');
        }

        if (!psw) {
            throw new Error(
                'Wrong SmscCallProvider configuration, please set "notifier.providers.smsc.password" param.',
            );
        }

        let response;
        try {
            response = await axios.post('https://smsc.ru/sys/send.php',
                null,
                {
                    params: {
                        login,
                        psw,
                        phones: phone,
                        voice: options.voice || 'm',
                        mes: options.message,
                        call: 1,
                        fmt: 3,
                    },
                });
        } catch (e) {
            throw new NotifierSendException(JSON.stringify(e));
        }

        if (response?.data?.error) {
            throw new NotifierSendException(response.data.error);
        }

        return response.data.code;
    }
}
