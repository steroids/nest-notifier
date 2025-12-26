import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierMailOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import {BatchResponse} from 'firebase-admin/lib/messaging';
import {Injectable} from '@nestjs/common';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {IMailService} from '../interfaces/IMailService';
import {NotifierSendLogService} from '../services/NotifierSendLogService';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';

@Injectable()
export class MailProvider implements INotifierProvider {
    public type = NotifierProviderType.MAIL;

    public name = 'mail';

    constructor(
        /** @see MailService **/
        private mailService: IMailService,
        private notifierSendLogService: NotifierSendLogService,
    ) {}

    async createLogs(sendRequestId: number, emails: string | string[], status: string, errorMessage?: string) {
        return Promise.all([].concat(emails).map(async (email) => {
            const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                sendRequestId,
                providerType: this.type,
                providerName: this.name,
                receiver: email,
                status,
                errorMessage,
            });
            const log = await this.notifierSendLogService.create(logDto);
            return log.id;
        }));
    }

    async send(options: INotifierMailOptions): Promise<{
        logsIds: number[],
        providerPayload: BatchResponse,
    }> {
        try {
            const response = await this.mailService.sendEmail(options);
            const logsIds = await this.createLogs(options.sendRequestId, options.to, NotifierStatusEnum.SENT);
            return {
                logsIds,
                providerPayload: response,
            };
        } catch (e) {
            console.error('Error sending email: ', e);
            const logsIds = await this.createLogs(
                options.sendRequestId,
                options.to,
                NotifierStatusEnum.ERROR,
                `Internal server error: ${e.toString()}`,
            );
            return {
                logsIds,
                providerPayload: null,
            };
        }
    }
}
