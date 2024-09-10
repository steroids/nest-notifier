import {initializeApp} from 'firebase-admin/app';
import {credential} from 'firebase-admin';
import {BatchResponse, getMessaging} from 'firebase-admin/messaging';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierPushOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierPushOptions';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';
import {NotifierSendPushLogSaveDto} from '../dtos/NotifierSendPushLogSaveDto';
import {NotifierSendLogService} from '../services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../services/NotifierSendPushLogService';

export class FirebasePushProvider implements INotifierProvider {
    public type = NotifierProviderType.PUSH;

    public name = 'firebase';

    constructor(
        private notifierSendLogService: NotifierSendLogService,
        private notifierSendPushLogService: NotifierSendPushLogService,
    ) {
        initializeApp({
            credential: credential.applicationDefault(),
        });
    }

    async send(options: INotifierPushOptions): Promise<{
        logsIds: number[],
        providerPayload: BatchResponse,
    }> {
        try {
            const batchResponse = await getMessaging().sendEachForMulticast(options);
            const logsIds = await Promise.all(batchResponse.responses.map(async (response, index) => {
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: options.tokens[index],
                    status: response.success
                        ? NotifierStatusEnum.SENT
                        : NotifierStatusEnum.ERROR,
                });
                const log = await this.notifierSendLogService.create(logDto);
                const pushLogDto = DataMapper.create<NotifierSendPushLogSaveDto>(NotifierSendPushLogSaveDto, {
                    sendLogId: log.id,
                    messageId: response.messageId,
                    errorCode: response.error?.code,
                    errorMessage: response.error?.message,
                });
                await this.notifierSendPushLogService.create(pushLogDto);
                return log.id;
            }));
            return {
                logsIds,
                providerPayload: batchResponse,
            };
        } catch (e) {
            console.error('Error sending push: ', e);
            const logsIds = await Promise.all(options.tokens.map(async (token) => {
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    sendRequestId: options.sendRequestId,
                    providerType: this.type,
                    providerName: this.name,
                    receiver: token,
                    status: NotifierStatusEnum.ERROR,
                    errorMessage: 'Internal server error: ' + e.toString(),
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
