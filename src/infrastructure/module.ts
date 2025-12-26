import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {NotifierSendLogService} from '../domain/services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../domain/services/NotifierSendPushLogService';
import {INotifierSendLogRepository} from '../domain/interfaces/INotifierSendLogRepository';
import {INotifierSendPushLogRepository} from '../domain/interfaces/INotifierSendPushLogRepository';
import {INotifierSendRequestRepository} from '../domain/interfaces/INotifierSendRequestRepository';
import {NotifierSendRequestService} from '../domain/services/NotifierSendRequestService';
import {INotifierProviderService} from '../domain/interfaces/INotifierProviderService';
import {NotifierService} from '../domain/services/NotifierService';
import {NotifierProviderService} from '../domain/services/NotifierProviderService';
import {NotifierSendRequestRepository} from './repositories/NotifierSendRequestRepository';
import {INotifierModuleConfig} from './config';
import {NotifierSendPushLogRepository} from './repositories/NotifierSendPushLogRepository';
import {NotifierSendLogRepository} from './repositories/NotifierSendLogRepository';

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
        NotifierSendRequestService,
        NotifierSendLogService,
        NotifierSendPushLogService,

        // Services
        {
            provide: INotifierProviderService,
            useClass: NotifierProviderService,
        },
        {
            provide: INotifierService,
            useClass: NotifierService,
        },
    ],
    exports: [
        INotifierService,
    ],
});
