import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
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
import {NotifierSendLogTable} from './tables/NotifierSendLogTable';
import {NotifierSendPushLogTable} from './tables/NotifierSendPushLogTable';
import {NotifierStoreMessageTable} from './tables/NotifierStoreMessageTable';

export interface INotifierModuleConfig {
    providers?: Record<string, any>,
}

export default {
    rootTarget: NotifierModule,
    config: () => ({
        providers: {
            smsRu: {
                apiId: process.env.NOTIFIER_SMS_RU_API_ID,
            },
            smsc: {
                login: process.env.NOTIFIER_SMSC_LOGIN,
                password: process.env.NOTIFIER_SMSC_PASSWORD,
            },
        },
    } as INotifierModuleConfig),
    entities: [
        NotifierSendLogTable,
        NotifierSendPushLogTable,
        NotifierStoreMessageTable,
    ],
    module: (config: INotifierModuleConfig) => ({
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
    }),
};
