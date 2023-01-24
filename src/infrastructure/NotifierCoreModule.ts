import {DynamicModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@steroidsjs/nest-typeorm';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {ConfigModule} from '@nestjs/config';
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

@Module({})
export class NotifierCoreModule {
    static forRoot(options): DynamicModule | any {
        return {
            module: NotifierModule,
            imports: [
                ConfigModule,
                TypeOrmModule.forFeature(ModuleHelper.importDir(`${__dirname}/tables`)),
            ],
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
                ModuleHelper.provide(NotifierService, [
                    [
                        StoreProvider,
                        FirebasePushProvider,
                    ],
                ]),
            ],
            exports: [
                NotifierService,
            ],
        };
    }
}
