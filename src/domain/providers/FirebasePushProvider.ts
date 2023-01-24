import { initializeApp } from 'firebase-admin/app';
import {credential} from 'firebase-admin';
import {getMessaging} from 'firebase-admin/messaging';
import {DataMapper} from '@steroidsjs/nest/usecases/helpers/DataMapper';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {
    INotifierBaseOptions,
    INotifierPushOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';
import {NotifierSendPushLogSaveDto} from '../dtos/NotifierSendPushLogSaveDto';
import {NotifierSendLogService} from '../services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../services/NotifierSendPushLogService';

export class FirebasePushProvider implements INotifierProvider {
    public type = NotifierProviderType.PUSH;

    public name = 'firebase-push';

    constructor(
        private notifierSendLogService: NotifierSendLogService,
        private notifierSendPushLogService: NotifierSendPushLogService,
    ) {
        initializeApp({
            credential: credential.applicationDefault(),
        });
    }

    async send(options: INotifierPushOptions & INotifierBaseOptions | any) {
        try {
            const response = await getMessaging().sendMulticast(options);
            const result = {
                logs: [],
            };
            for (const [index, resp] of response.responses.entries()) {
                const logDto = DataMapper.create<NotifierSendLogSaveDto>(NotifierSendLogSaveDto, {
                    provider: NotifierProviderType.PUSH,
                    status: resp.success
                        ? NotifierStatusEnum.SENT
                        : NotifierStatusEnum.ERROR,
                });
                const log = await this.notifierSendLogService.create(logDto);
                const pushLogDto = DataMapper.create<NotifierSendPushLogSaveDto>(NotifierSendPushLogSaveDto, {
                    sendLogId: log.id,
                    messageId: resp.messageId,
                    errorCode: resp.error?.code,
                    errorMessage: resp.error?.message,
                });
                setTimeout(() => this.notifierSendPushLogService.create(pushLogDto));
                result.logs.push({
                    logId: log.id,
                    token: options.tokens[index],
                });
            }
            return result;
        } catch (e) {
            console.log('Error sending message:', e);
        }
    }
}
