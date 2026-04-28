# nest-notifier

Модуль уведомлений для библиотеки [Steroids Nest](https://github.com/steroids/nest)

# Предназначение

Модуль позволяет быстро внедрить в проект функциональность, связанную с отправкой уведомлений различными способами,
а также отслеживанием отправки этих уведомлений.

Уведомления отправляются через сущность "провайдер уведомлений", которая отвечает за интеграцию с конкретным сервисом
(например, Firebase, SMSC, SMS.ru и т.д.).

Можно создавать свои типы уведомлений и соответствующие им провайдеры, а также использовать уже готовые:
- электронные письма
- SMS
- push-уведомления
- голосовые звонки
- голосовые сообщения

# Быстрый старт

Для того чтобы подключить NotifierModule в существующий проект на Steroids Nest
нужно:
1. Добавить в проект саму библиотеку @steroidsjs/nest-notifier
2. Добавить в проект @steroidsjs/nest-modules, которая содержит соответствующие интерфейсы
3. Определить локальный `NotifierModule` и импортировать в него `CoreNotifierModule.registerAsync(...)`.
4. Импортировать созданный `NotifierModule` в главный модуль приложения.
5. Сгенерировать и запустить миграции для создания таблиц в базе данных

# Пример подключения модуля в проект

Для примера, добавим в проект модуль уведомлений, который будет отправлять SMS через SMSC
и сохранять логи отправки в базу данных.

1. Установим пакеты:
```sh
yarn add @steroidsjs/nest-notifier @steroidsjs/nest-modules
```

2. Определим локальный `NotifierModule` и подключим нужные provider-модули.

```typescript
import {NotifierModule as CoreNotifierModule} from '@steroidsjs/nest-notifier/infrastructure/NotifierModule';
import {firebasePushProviderModule} from '@steroidsjs/nest-notifier/providers/firebase';
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';

const NOTIFIER_MIGRATIONS_MODULE_NAME = 'notifier';

@Module({
    module: () => ({
        imports: [
            CoreNotifierModule.registerAsync({
                migrationsModuleName: NOTIFIER_MIGRATIONS_MODULE_NAME,
                providerModules: [
                    firebasePushProviderModule,
                ],
            }),
        ],
        providers: [],
        exports: [
            CoreNotifierModule,
        ],
    }),
})
export class NotifierModule {}
```

`migrationsModuleName` должен совпадать с именем модуля проекта, в который генератор миграций должен складывать миграции.
Например, если локальный модуль лежит в `src/notifier`, передайте `notifier`.

3. Импортируем созданный модуль в главный модуль проекта:
```typescript
import coreModule from '@steroidsjs/nest/infrastructure/applications/rest/config';
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import {NotifierModule} from '../../notifier/infrastructure/NotifierModule';

@Module({
    ...coreModule,
    module: (config) => {
        const module = coreModule.module(config);
        return {
            ...module,
            imports: [
                ...(module.imports ?? []), 
                NotifierModule,
            ],
        };
    },
})
export class AppModule {}
```

4. Сгенерируем и запустим миграции для создания таблиц в базе данных:

```shell
yarn cli migrate:generate
yarn cli migrate
```

# Устройство модуля

## Конфигурация

Конфигурация модуля определена интерфейсом `INotifierModuleConfig` (находится в файле `src/infrastructure/config.ts`).
Интерфейс INotifierModuleConfig описывает конфигурацию модуля уведомлений,
в которой задаются поддерживаемые провайдеры и их параметры, включая данные авторизации.

## Провайдеры уведомлений

Провайдер уведомлений — это класс, отвечающий за отправку уведомлений. 
Он реализует интерфейс `INotifierProvider` и содержит код, который выполняет отправку через конкретный сервис.

Реализованные провайдеры:

- [FirebasePushProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/firebase/infrastructure/providers/FirebasePushProvider.ts) - отправка push-уведомлений через [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging?hl=en)
- [MailProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/mail/infrastructure/providers/MailProvider.ts) - отправка писем по электронной почте с помощью [NestJS Mailer](https://nest-modules.github.io/mailer/)
- [SmscCallProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/smsc/infrastructure/providers/SmscCallProvider.ts) - отправка звонков через [SMSC](https://smsc.ru/api/http/send/voice/#menu)
- [SmscSmsProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/smsc/infrastructure/providers/SmscSmsProvider.ts) - отправка SMS через [SMSC](https://smsc.ru/api/http/send/sms/#menu)
- [SmscVoiceMessageProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/smsc/infrastructure/providers/SmscVoiceMessageProvider.ts) - отправка голосовых сообщений через [SMSC](https://smsc.ru/api/http/send/voice/#menu)
- [SmsRuCallProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/smsRu/infrastructure/providers/SmsRuCallProvider.ts) - отправка звонков через [SMS.ru](https://sms.ru/api/code_call)
- [SmsRuSmsProvider](https://github.com/steroids/nest-notifier/blob/main/src/providers/smsRu/infrastructure/providers/SmsRuSmsProvider.ts) - отправка SMS через [SMS.ru](https://sms.ru/api/send)

### Модули провайдеров

Провайдеры можно подключать через `NotifierModule.registerAsync({providerModules})`.
Каждый провайдер подключается как отдельный Nest/Steroids module, который сам объявляет свои `providers`, `exports` и, если нужно, `tables`.
Основной notifier импортирует эти модули, а таблицы provider-модулей попадут в TypeORM entities только если соответствующий модуль подключён.
Код провайдеров лежит отдельно от core-модуля: `src/providers/<provider>/domain` и `src/providers/<provider>/infrastructure`.
Контракты, модели и сервисы хранения контактной информации находятся в `domain`, а конкретные адаптеры внешних сервисов - в `infrastructure/providers`.

Для Firebase push дополнительно подключается `NotifierPushTokenService` и таблица `notifier_push_token`:

```typescript
import {Module} from '@nestjs/common';
import {NotifierModule as CoreNotifierModule} from '@steroidsjs/nest-notifier/infrastructure/NotifierModule';
import {firebasePushProviderModule} from '@steroidsjs/nest-notifier/providers/firebase';

const NOTIFIER_MIGRATIONS_MODULE_NAME = 'notifier';

@Module({
    imports: [
        CoreNotifierModule.registerAsync({
            migrationsModuleName: NOTIFIER_MIGRATIONS_MODULE_NAME,
            providerModules: [
                firebasePushProviderModule,
            ],
        }),
    ],
    exports: [
        CoreNotifierModule,
    ],
})
export class NotifierModule {}
```

### Собственные провайдеры в проекте

Проект может добавить собственный провайдер уведомлений наравне с провайдерами из пакета.
Для этого нужно:
- реализовать сервис, который соответствует `INotifierProvider`;
- объявить обычный Nest module, который регистрирует и экспортирует этот сервис;
- создать descriptor `INotifierProviderModule` и передать его в `providerModules`.

```typescript
import {Module} from '@nestjs/common';
import {INotifierProviderModule} from '@steroidsjs/nest-notifier/domain/interfaces/INotifierProviderModule';
import {LocalSmsProvider} from './providers/LocalSmsProvider';

@Module({
    providers: [
        LocalSmsProvider,
    ],
    exports: [
        LocalSmsProvider,
    ],
})
export class LocalSmsProviderModule {}

export const localSmsProviderModule: INotifierProviderModule = {
    module: LocalSmsProviderModule,
    notifierProviders: [
        LocalSmsProvider,
    ],
};
```

Если провайдеру нужны свои таблицы, добавьте их в descriptor:

```typescript
export const localSmsProviderModule: INotifierProviderModule = {
    module: LocalSmsProviderModule,
    tables: [
        LocalSmsMessageTable,
    ],
    notifierProviders: [
        LocalSmsProvider,
    ],
};
```

После этого подключите descriptor в локальном `NotifierModule`:

```typescript
CoreNotifierModule.registerAsync({
    migrationsModuleName: NOTIFIER_MIGRATIONS_MODULE_NAME,
    providerModules: [
        firebasePushProviderModule,
        localSmsProviderModule,
    ],
})
```

## Модели

#### NotifierPushTokenModel
Device token для push-уведомлений. Подключается вместе с `firebasePushProviderModule`, чтобы таблица создавалась только в проектах, где используется Firebase push.

Для чего можно использовать:
- Хранение токенов устройств пользователя.
- Получение токенов через `NotifierPushTokenService.findTokensByUserId()` перед отправкой push-уведомления.

#### NotifierSendLogModel
Основной лог отправки уведомления. Содержит тип, имя провайдера, статус отправки, сообщение об ошибке,
получателя и (опционально) детали push-отправки.

Для чего можно использовать:
- Отладка сбоев при интеграции с внешними провайдерами.
- Аналитика успешных и неуспешных отправок по типу уведомлений и провайдерам.

#### NotifierSendPushLogModel
Детализированный лог отправки push-уведомлений. Содержит внешний ID, код и описание ошибки.

Для чего можно использовать:
- Отладка сбоев при доставке push-сообщений.
- Связывание с внешними системами по `messageId`.

#### NotifierSendRequestModel
Модель запроса на отправку уведомлений. 
Хранит список связанных логов (`NotifierSendLogModel`) по каждому провайдеру,
участвующему в отправке одного уведомления.

Для чего можно использовать:
- Группировка мультиканальных отправок.
- Централизованный контроль для одного логического уведомления по разным каналам.

## Доменные сервисы

Кроме сервисов для CRUD-операций над моделями, в модуле определён сервис `NotifierService`,
который отвечает за отправку уведомлений через различные каналы (sms, call, mail, push, voice).
Этот сервис вызывает нужный провайдер уведомлений в зависимости от типа уведомления, который нужно отправить.

# Пример использования `NotifierService`

```typescript
import {Inject} from '@nestjs/common';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {IAuthConfirmServiceConfig} from '../config/IAuthConfirmServiceConfig';

export class AuthConfirmService {
    constructor(
        @Inject(INotifierService)
        protected readonly notifierService: INotifierService,
    ) {
    }

    protected async sendSms(config: IAuthConfirmServiceConfig, phone: string) {
        code = generateCode(config.smsCodeLength);
        
        await this.notifierService.send({
            sms: {
                phone,
                message: config.messageTemplate.replace('{code}', code),
                name: config.providerName,
            },
        });
        
        return code;
    }
}
```

Что происходит внутри `NotifierService` (используемого в примере через интерфейс `INotifierService`):
- Вызывается метод `send` с объектом, ключи которого указывают на тип уведомления (`sms = NotifierProviderType.SMS`),
а также параметры для этих уведомлений.
- `NotifierService` выбирает активного провайдера для типа `NotifierProviderType.SMS`.
- Создаётся запись о запросе на уведомление (`NotifierSendRequestService`).
- Выполняется отправка через соответствующий `INotifierProvider` (например, через `SmsRuSmsProvider`).
- Внутри провайдера создаются записи логов (`NotifierSendLogModel`), привязанные к переданному id запроса на уведомление (`NotifierSendRequestService`).
- Для push-уведомлений дополнительно сохраняется запись `NotifierSendPushLogModel`, связанная с конкретным `NotifierSendLogModel`.
- Возвращается результат отправки, включая id запроса на уведомление (`NotifierSendRequestModel`)
и данные от провайдера (id моделей `NotifierSendLogModel` и payload от провайдера).

> Можно одновременно отправить уведомления нескольких типов, передав объект с несколькими ключами
 
> Для каждого способа отправки нужно передавать разные данные, которые описаны в соответствующих интерфейсах.
Эти интерфейсы находятся в `@steroidsjs/nest-modules/notifier/interfaces`.
