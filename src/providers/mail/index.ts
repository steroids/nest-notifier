import {INotifierProviderModule} from '../../domain/interfaces/INotifierProviderModule';
import {MailProviderModule} from './infrastructure/MailProviderModule';
import {MailProvider} from './infrastructure/providers/MailProvider';

/**
 * Провайдер для отправки email-уведомлений.
 *
 * Примечание: Для работы MailProvider вы также должны [подключить MailerModule](https://nest-modules.github.io/mailer/docs/mailer#configuration)
 * из @nestjs-modules/mailer к своему модулю
 */
export const mailProviderModule: INotifierProviderModule = {
    module: MailProviderModule,
    notifierProviders: [
        MailProvider,
    ],
};
