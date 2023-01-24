import axios from 'axios';
import {ConfigService} from '@nestjs/config';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierSmsOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';

export class SmsRuSmsProvider implements INotifierProvider {
    public type = NotifierProviderType.SMS;

    public name = 'smsRu';

    constructor(
        public configService: ConfigService,
    ) {
    }

    async send(options: INotifierSmsOptions & INotifierBaseOptions) {
        let phone = options.phone;
        phone = phone.replace('/[^0-9]+/', '');
        phone = phone.replace('/^8/', '7');

        if (!this.configService.get('notifier.providers.smsRu.apiId')) {
            throw new Error(
                'Wrong SmsRuCallProvider configuration, please set "notifier.providers.smsRu.apiId" param.',
            );
        }

        let response;
        try {
            response = await axios.get('https://sms.ru/sms/send', {
                params: {
                    api_id: this.configService.get('notifier.providers.smsRu.apiId'),
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
