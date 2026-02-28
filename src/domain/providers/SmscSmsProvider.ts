import axios from 'axios';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierSmsOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {Injectable} from '@nestjs/common';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {INotifierModuleConfig} from '../../infrastructure/config';
import {NotifierSendLogService} from '../services/NotifierSendLogService';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';

/**
 * Провайдер для отправки SMS через Smsc.ru.
 */
@Injectable()
export class SmscSmsProvider implements INotifierProvider {
    public type = NotifierProviderType.SMS;

    public name = 'smsc';

    constructor(
        private readonly notifierSendLogService: NotifierSendLogService,
    ) {}

    async send(options: INotifierSmsOptions): Promise<{
        logsIds: number[],
        providerPayload: any,
    }> {
        const credentials = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule).providers.sms.smsc;

        try {
            if (!credentials.login) {
                throw new Error('Wrong SmscSmsProvider configuration, please set "notifier.providers.sms.smsc.login" param.');
            }
            if (!credentials.password) {
                throw new Error('Wrong SmscSmsProvider configuration, please set "notifier.providers.sms.smsc.password" param.');
            }

            const normalizedPhones = [].concat(options.phone)
                .map(phone => phone.replace('/[^0-9]+/', '').replace('/^8/', '7'));

            const response = await axios.get('https://smsc.ru/sys/send.php', {
                params: {
                    login: credentials.login,
                    psw: credentials.password,
                    phones: normalizedPhones,
                    mes: options.message,
                    sender: options.sender,
                    fmt: 3,
                    op: 1,
                },
            });

            const logsIds = [];
            for (const phoneInfo of response.data.phones) {
                const status = Number(phoneInfo.status);
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: phoneInfo.phone,
                });
                if (status && status !== 1) {
                    logDto.status = NotifierStatusEnum.ERROR;
                    logDto.errorMessage = phoneInfo.error;
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
