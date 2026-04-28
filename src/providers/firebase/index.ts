import {INotifierProviderModule} from '../../domain/interfaces/INotifierProviderModule';
import {FirebasePushProvider} from './infrastructure/providers/FirebasePushProvider';
import {FirebasePushProviderModule} from './infrastructure/FirebasePushProviderModule';
import {NotifierPushTokenTable} from './infrastructure/tables/NotifierPushTokenTable';

/**
 * Провайдер для отправки push-уведомлений через Firebase Cloud Messaging.
 *
 * Для работы FirebasePushProvider вам необходимо [получить ключ сервера Firebase](https://firebase.google.com/docs/cloud-messaging/auth-server?hl=ru)
 * и указать путь к нему в переменной среды вашей операционной системы GOOGLE_APPLICATION_CREDENTIALS.
 */
export const firebasePushProviderModule: INotifierProviderModule = {
    module: FirebasePushProviderModule,
    tables: [
        NotifierPushTokenTable,
    ],
    notifierProviders: [
        FirebasePushProvider,
    ],
};
