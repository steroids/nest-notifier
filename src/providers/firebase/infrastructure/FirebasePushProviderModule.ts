import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {INotifierPushTokenRepository} from '../domain/interfaces/INotifierPushTokenRepository';
import {NotifierPushTokenService} from '../domain/services/NotifierPushTokenService';
import {FirebasePushProvider} from './providers/FirebasePushProvider';
import {NotifierPushTokenRepository} from './repositories/NotifierPushTokenRepository';
import {NotifierPushTokenTable} from './tables/NotifierPushTokenTable';

@Module({
    tables: [
        NotifierPushTokenTable,
    ],
    module: () => ({
        imports: [
            NotifierCoreModule,
        ],
        providers: [
            {
                provide: INotifierPushTokenRepository,
                useClass: NotifierPushTokenRepository,
            },
            NotifierPushTokenService,
            FirebasePushProvider,
        ],
        exports: [
            NotifierPushTokenService,
            FirebasePushProvider,
        ],
    }),
})
export class FirebasePushProviderModule {}
