import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierCallOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {INotifierModuleConfig} from '../../infrastructure/config';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';

export class SmsRuCallProvider implements INotifierProvider {
    public type = NotifierProviderType.CALL;

    public name = 'smsRu';

    constructor(
    ) {
    }

    async send(options: INotifierCallOptions & INotifierBaseOptions) {
        let phone = options.phone;
        phone = phone.replace(/[^0-9]+/, '');
        phone = phone.replace(/^8/, '7');

        const apiId = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule)?.providers?.smsRu?.apiId;
        if (!apiId) {
            throw new Error(
                'Wrong SmsRuCallProvider configuration, please set "notifier.providers.smsRu.apiId" param.',
            );
        }

        let response;
        try {
            response = await axios.get('https://sms.ru/code/call', {
                params: {
                    api_id: apiId,
                    phone,
                },
            });
        } catch (e) {
            throw new NotifierSendException(JSON.stringify(e));
        }

        if (response.data.status === 'ERROR') {
            throw new NotifierSendException(response.data.status_text);
        }
        if (!response.data.code) {
            throw new NotifierSendException('SMS.RU, not found code in response: ' + JSON.stringify(response.data));
        }

        return response.data.code;
    }
}
