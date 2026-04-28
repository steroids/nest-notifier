import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import {INotifierProviderService} from '../domain/interfaces/INotifierProviderService';
import {INotifierSendLogRepository} from '../domain/interfaces/INotifierSendLogRepository';
import {INotifierSendPushLogRepository} from '../domain/interfaces/INotifierSendPushLogRepository';
import {INotifierSendRequestRepository} from '../domain/interfaces/INotifierSendRequestRepository';
import {NotifierProviderService} from '../domain/services/NotifierProviderService';
import {NotifierSendLogService} from '../domain/services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../domain/services/NotifierSendPushLogService';
import {NotifierSendRequestService} from '../domain/services/NotifierSendRequestService';
import {NotifierSendLogRepository} from './repositories/NotifierSendLogRepository';
import {NotifierSendPushLogRepository} from './repositories/NotifierSendPushLogRepository';
import {NotifierSendRequestRepository} from './repositories/NotifierSendRequestRepository';
import tables from './tables';

@Module({
    tables,
    module: () => ({
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
            {
                provide: INotifierProviderService,
                useClass: NotifierProviderService,
            },
        ],
        exports: [
            NotifierSendRequestService,
            NotifierSendLogService,
            NotifierSendPushLogService,
            INotifierProviderService,
        ],
    }),
})
export class NotifierCoreModule {}
