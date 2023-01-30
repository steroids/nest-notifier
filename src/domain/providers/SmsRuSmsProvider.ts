import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierSmsOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {INotifierModuleConfig} from '../../infrastructure/config';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';

export class SmsRuSmsProvider implements INotifierProvider {
    public type = NotifierProviderType.SMS;

    public name = 'smsRu';

    constructor(
    ) {
    }

    async send(options: INotifierSmsOptions & INotifierBaseOptions) {
        let phone = options.phone;
        phone = phone.replace('/[^0-9]+/', '');
        phone = phone.replace('/^8/', '7');

        const apiId = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule)?.providers?.smsRu?.apiId;
        if (!apiId) {
            throw new Error(
                'Wrong SmsRuCallProvider configuration, please set "notifier.providers.smsRu.apiId" param.',
            );
        }

        let response;
        try {
            response = await axios.get('https://sms.ru/sms/send', {
                params: {
                    api_id: apiId,
                    to: phone,
                    msg: options.message,
                    from: options.sender,
                    json: 1,
                },
            });
        } catch (e) {
            throw new NotifierSendException(JSON.stringify(e));
        }

        Object.entries(response.data.sms)
            .forEach(([phoneItem, result]: Array<any>) => {
                if (result.status !== 'OK') {
                    throw new NotifierSendException(
                        `code ${result.status_code}, phone ${phoneItem}, text: ${result.status_text}`,
                    );
                }
            });
    }
}
