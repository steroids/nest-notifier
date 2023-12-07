# nest-notifier

A module for Nest.js application that provides a set of providers for sending SMS, calls, email, push notifications.
The following providers are currently available:

- [FirebasePushProvider](https://firebase.google.com/products/cloud-messaging?hl=en)
- [MailProvider](https://nest-modules.github.io/mailer/)
- [SmscCallProvider](https://smsc.ru/api/http/send/voice/#menu)
- [SmscSmsProvider](https://smsc.ru/api/http/send/sms/#menu)
- [SmscVoiceMessageProvider](https://smsc.ru/api/http/send/voice/#menu)
- [SmsRuCallProvider](https://sms.ru/api/code_call)
- [SmsRuSmsProvider](https://sms.ru/api/send)

## Getting started
Install package:
```sh
yarn add @steroidsjs/nest-notifier
```


Create Steroids.js Nest module, based on installed module. Add the necessary providers from the module to the providers array. Connect the NotifierService service and pass the connected providers to it.
```ts
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import coreModule from '@steroidsjs/nest-notifier';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {NotifierService} from '@steroidsjs/nest-notifier/domain/services/NotifierService';
import {SmscSmsProvider} from '@steroidsjs/nest-notifier/domain/providers/SmscSmsProvider';
import {FirebasePushProvider} from '@steroidsjs/nest-notifier/domain/providers/FirebasePushProvider';
import {IProviderService} from '@steroidsjs/nest-notifier/domain/interfaces/IProviderService';
import {NotifierSendRequestService} from '@steroidsjs/nest-notifier/domain/services/NotifierSendRequestService';

@Module({
    ...coreModule,
    module: () => ({
        imports: [],
        providers: [
            SmscSmsProvider,
            FirebasePushProvider,
            ModuleHelper.provide(NotifierService, INotifierService, [
                IProviderService,
                NotifierSendRequestService,
                [
                    SmscSmsProvider,
                    FirebasePushProvider,
                ],
            ]),
        ],
        exports: [
            INotifierService,
        ],
    }),
})
export class NotifierModule {}

```
Set the environment variables required for the providers you have connected. You can look at the [configuration file](https://github.com/steroids/nest-notifier/blob/main/src/infrastructure/config.ts) to determine the required variables. You can also define your own configuration file that implements the INotifierModuleConfig interface and add this file to the module.

> Note: For FirebasePushProvider to work, you need to [get the Firebase server key](https://firebase.google.com/docs/cloud-messaging/auth-server?hl=ru) and specify the path to it in your OS environment variable GOOGLE_APPLICATION_CREDENTIALS.

> Note: For MailProvider to work, you must also [connect MailerModule](https://nest-modules.github.io/mailer/docs/mailer#configuration) from @nestjs-modules/mailer to your module

Generate and apply migrations:
```sh
yarn cli migrate:generate
yarn cli migrate
```

After setting up the module, inject INotifierService into the NestJS service you need and send a message using the send method:
```ts
export class AuthConfirmService {
    constructor(
        protected readonly notifierService: INotifierService,
    ) {}

    protected async sendCall(config: IAuthConfirmServiceConfig, phone: string) {
        const response = await this.notifierService.send({
            [NotifierProviderType.CALL]: {
                phone,
            } as INotifierCallOptions,
        });

        code = response[NotifierProviderType.CALL];

        return code;
    }
}
```
