import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierCallOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {INotifierModuleConfig} from '../../infrastructure/config';

export class SmscCallProvider implements INotifierProvider {
    public type = NotifierProviderType.CALL;

    public name = 'smsc';

    constructor(
    ) {
    }

    async send(options: INotifierCallOptions & INotifierBaseOptions) {
        let phone = options.phone;
        phone = phone.replace('/[^0-9]+/', '');
        phone = phone.replace('/^8/', '7');

        const {login, password} = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule)?.providers?.smsc || {};
        if (!login) {
            throw new Error('Wrong SmscCallProvider configuration, please set "notifier.providers.smsc.login" param.');
        }
        if (!password) {
            throw new Error('Wrong SmscCallProvider configuration, please set "notifier.providers.smsc.password" param.');
        }

        let response;
        try {
            response = await axios.post('https://smsc.ru/sys/send.php',
                null,
                {
                    params: {
                        login,
                        psw: password,
                        phones: phone,
                        mes: 'code',
                        call: 1,
                        fmt: 3,
                    },
                });
        } catch (e) {
            throw new NotifierSendException(JSON.stringify(e));
        }

        if (response.data.error) {
            throw new NotifierSendException(response.data.error);
        }

        if (!response.data.code) {
            throw new NotifierSendException('SMSC.RU, not found code in response: ' + JSON.stringify(response.data));
        }

        return response.data.code;
    }
}
