import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierCallOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {Injectable} from '@nestjs/common';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {INotifierModuleConfig} from '../../infrastructure/config';
import {NotifierSendLogService} from '../services/NotifierSendLogService';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';

@Injectable()
export class SmsRuCallProvider implements INotifierProvider {
    public type = NotifierProviderType.CALL;

    public name = 'smsRu';

    constructor(
        private readonly notifierSendLogService: NotifierSendLogService,
    ) {}

    async send(options: INotifierCallOptions): Promise<{
        logsIds: number[],
        providerPayload: any,
    }> {
        const credentials = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule).providers.call.smsRu;

        const resultPayload = [];
        const logsIds = [];
        for (const phone of [].concat(options.phone)) {
            const normalizedPhone = phone.replace('/[^0-9]+/', '').replace('/^8/', '7');
            try {
                if (!credentials.apiId) {
                    throw new Error('Wrong SmsRuCallProvider configuration, please set "notifier.providers.call.smsRu.apiId" param.');
                }

                const response = await axios.get('https://sms.ru/code/call', {
                    params: {
                        api_id: credentials.apiId,
                        phone: normalizedPhone,
                        ip: options.requestingIp,
                    },
                });

                if (response.data.status !== 'OK') {
                    throw new NotifierSendException(response.data.error);
                }

                if (!response.data.code) {
                    throw new NotifierSendException('SMS.RU, not found code in response: ' + JSON.stringify(response.data));
                }
                resultPayload.push(response.data);

                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: normalizedPhone,
                    status: NotifierStatusEnum.SENT,
                });
                const log = await this.notifierSendLogService.create(logDto);
                logsIds.push(log.id);
            } catch (e) {
                console.error('Error sending call: ', e);
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: normalizedPhone,
                    status: NotifierStatusEnum.ERROR,
                    errorMessage: e.toString(),
                });
                const log = await this.notifierSendLogService.create(logDto);
                logsIds.push(log.id);
            }
        }

        return {
            logsIds,
            providerPayload: resultPayload,
        };
    }
}
