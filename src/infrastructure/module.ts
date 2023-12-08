import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {NotifierSendLogService} from '../domain/services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../domain/services/NotifierSendPushLogService';
import {INotifierSendLogRepository} from '../domain/interfaces/INotifierSendLogRepository';
import {NotifierSendLogRepository} from './repositories/NotifierSendLogRepository';
import {INotifierSendPushLogRepository} from '../domain/interfaces/INotifierSendPushLogRepository';
import {NotifierSendPushLogRepository} from './repositories/NotifierSendPushLogRepository';
import {INotifierModuleConfig} from './config';
import {INotifierSendRequestRepository} from '../domain/interfaces/INotifierSendRequestRepository';
import { NotifierSendRequestRepository } from './repositories/NotifierSendRequestRepository';
import {NotifierSendRequestService} from '../domain/services/NotifierSendRequestService';
import {SmscCallProvider} from '../domain/providers/SmscCallProvider';
import {SmscSmsProvider} from '../domain/providers/SmscSmsProvider';
import {SmscVoiceMessageProvider} from '../domain/providers/SmscVoiceMessageProvider';
import {SmsRuCallProvider} from '../domain/providers/SmsRuCallProvider';
import {SmsRuSmsProvider} from '../domain/providers/SmsRuSmsProvider';
import {INotifierProviderService} from '../domain/interfaces/INotifierProviderService';
import {NotifierService} from '../domain/services/NotifierService';
import {NotifierProviderService} from '../domain/services/NotifierProviderService';

export default (config: INotifierModuleConfig) => ({
    providers: [
        {
            provide: INotifierSendRequestRepository,
            useClass: NotifierSendRequestRepository,
        },
        {
            provide: INotifierSendLogRepository,
            useClass: NotifierSendLogRepository,
        },
        {
            provide: INotifierSendPushLogRepository,
            useClass: NotifierSendPushLogRepository,
        },
        ModuleHelper.provide(NotifierSendRequestService, [
            INotifierSendRequestRepository,
        ]),
        ModuleHelper.provide(NotifierSendLogService, [
            INotifierSendLogRepository,
        ]),
        ModuleHelper.provide(NotifierSendPushLogService, [
            INotifierSendPushLogRepository,
        ]),

        // Providers
        ModuleHelper.provide(SmscCallProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmscSmsProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmscVoiceMessageProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmsRuCallProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmsRuSmsProvider, [
            NotifierSendLogService,
        ]),

        // Services
        {
            provide: INotifierProviderService,
            useClass: NotifierProviderService,
        },
        ModuleHelper.provide(INotifierService, NotifierService, [
            INotifierProviderService,
            NotifierSendRequestService,
            [
                SmscCallProvider,
                SmscSmsProvider,
                SmscVoiceMessageProvider,
                SmsRuCallProvider,
                SmsRuSmsProvider,
            ],
        ]),
    ],
    exports: [
        INotifierService,
    ],
});
