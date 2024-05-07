import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierSmsOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import NotifierSendException from '@steroidsjs/nest-modules/notifier/exceptions/NotifierSendException';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {INotifierModuleConfig} from '../../infrastructure/config';
import {NotifierSendLogService} from '../services/NotifierSendLogService';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';

export class SmsRuSmsProvider implements INotifierProvider {
    public type = NotifierProviderType.SMS;

    public name = 'smsRu';

    constructor(private notifierSendLogService: NotifierSendLogService) {}

    async send(options: INotifierSmsOptions) {
        const credentials = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule).providers.sms.smsRu;

        try {
            if (!credentials.apiId) {
                throw new Error('Wrong SmsRuSmsProvider configuration, please set "notifier.providers.sms.smsRu.apiId" param.');
            }

            const normalizedPhones = [].concat(options.phone)
                .map(phone => phone.replace('/[^0-9]+/', '').replace('/^8/', '7'));

            const params: any = {
                api_id: credentials.apiId,
                to: normalizedPhones,
                msg: options.message,
                from: options.sender,
                json: 1,
            };
            if (options.requestingIp) {
                params.ip = options.requestingIp;
            }
            const response = await axios.get('https://sms.ru/sms/send', {
                params,
            });

            if (response.data.status_code !== 100) {
                throw new NotifierSendException(JSON.stringify(response.data));
            }

            const logsIds = [];
            for (const [phone, info] of Object.entries(response.data.sms)) {
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: phone,
                });
                if ((info as any).status_code !== 100) {
                    logDto.status = NotifierStatusEnum.ERROR;
                    logDto.errorMessage = (info as any).status;
                } else {
                    logDto.status = NotifierStatusEnum.SENT;
                }
                const log = await this.notifierSendLogService.create(logDto);
                logsIds.push(log.id);
            }

            return {
                logsIds,
                providerPayload: response.data,
            };
        } catch (e) {
            console.error('Error sending sms: ', e);
            const logsIds = await Promise.all([].concat(options.phone).map(async (phone) => {
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: phone,
                    status: NotifierStatusEnum.ERROR,
                    errorMessage: e.toString(),
                });
                const log = await this.notifierSendLogService.create(logDto);
                return log.id;
            }));

            return {
                logsIds,
                providerPayload: null,
            };
        }
    }
}
