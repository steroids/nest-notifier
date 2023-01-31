import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {INotifierStoreMessageRepository} from '../domain/interfaces/INotifierStoreMessageRepository';
import {NotifierStoreMessageRepository} from './repositories/NotifierStoreMessageRepository';
import {NotifierService} from '../domain/services/NotifierService';
import {StoreProvider} from '../domain/providers/StoreProvider';
import NotifierStoreService from '../domain/services/NotifierStoreService';
import {FirebasePushProvider} from '../domain/providers/FirebasePushProvider';
import {NotifierSendLogService} from '../domain/services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../domain/services/NotifierSendPushLogService';
import {INotifierSendLogRepository} from '../domain/interfaces/INotifierSendLogRepository';
import {NotifierSendLogRepository} from './repositories/NotifierSendLogRepository';
import {INotifierSendPushLogRepository} from '../domain/interfaces/INotifierSendPushLogRepository';
import {NotifierSendPushLogRepository} from './repositories/NotifierSendPushLogRepository';
import {INotifierModuleConfig} from './config';

export default (config: INotifierModuleConfig) => ({
    providers: [
        {
            provide: INotifierStoreMessageRepository,
            useClass: NotifierStoreMessageRepository,
        },
        {
            provide: INotifierSendLogRepository,
            useClass: NotifierSendLogRepository,
        },
        {
            provide: INotifierSendPushLogRepository,
            useClass: NotifierSendPushLogRepository,
        },
        ModuleHelper.provide(NotifierSendLogService, [
            INotifierSendLogRepository,
        ]),
        ModuleHelper.provide(NotifierSendPushLogService, [
            INotifierSendPushLogRepository,
        ]),
        ModuleHelper.provide(NotifierStoreService, [
            INotifierStoreMessageRepository,
        ]),
        ModuleHelper.provide(StoreProvider, [
            NotifierStoreService,
        ]),
        ModuleHelper.provide(FirebasePushProvider, [
            NotifierSendLogService,
            NotifierSendPushLogService,
        ]),
        {
            inject: [
                StoreProvider,
                FirebasePushProvider,
            ],
            provide: INotifierService,
            useFactory: (storeProvider, firebasePushProvider) => new NotifierService([
                storeProvider,
                firebasePushProvider,
            ]),
        },
    ],
    exports: [
        INotifierService,
    ],
});
