# Steroids Nest Notifier Migration Guide

## [0.6.0](../CHANGELOG.md#060-2026-08-11) (2026-08-11)

### Поддержка NestJS 11

Новый релиз `@steroidsjs/nest-notifier` будет одновременно поддерживать NestJS 10 и NestJS 11.
Обновление пакета не требует обязательного перехода на NestJS 11: приложение может сохранить NestJS 10 и совместимые с ним версии остальных зависимостей.

Для перехода приложения на NestJS 11 обновите NestJS-зависимости согласованно:

```json
{
  "dependencies": {
    "@nestjs/common": "^11.1.28",
    "@nestjs/core": "^11.1.28",
    "@nestjs/typeorm": "^11.0.3"
  },
  "devDependencies": {
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.1.28"
  }
}
```

Перед обновлением также необходимо:

1. Обновить `@steroidsjs/nest` до версии с поддержкой NestJS 11.
2. Проверить `peerDependencies` остальных NestJS- и `@steroidsjs/*`-пакетов приложения.
3. Не смешивать разные major-версии `@nestjs/common`, `@nestjs/core` и `@nestjs/testing`.

`@nestjs/typeorm@^11.0.3` уже поддерживает обе major-версии NestJS и не требует отдельного обновления. Минимальная версия Node.js для `@steroidsjs/nest-notifier` остаётся равна 22.

### Обновление Mailer

Поддерживаемый диапазон `@nestjs-modules/mailer` изменён на `^1.11.2 || ^2.0.0`. Версия `1.8.1`, указанная ранее, не заявляет совместимость с NestJS 10 и NestJS 11.

Если приложение использует `MailProvider`, обновите Mailer. Для нового проекта на NestJS 11 рекомендуется актуальная ветка Mailer 2 с Nodemailer 8:

```json
{
  "dependencies": {
    "@nestjs-modules/mailer": "^2.3.7",
    "nodemailer": "^8.0.5"
  }
}
```

Публичные методы `MailerService.sendMail` и `MailService.sendEmail` не изменились. Существующую конфигурацию `MailerModule` необходимо проверить только на предмет требований выбранного transport и template adapter.

Зависимость от `@nestjs-modules/mailer` теперь опциональна. Если приложение использует только Firebase-, SMS- или call-провайдеры, устанавливать Mailer и Nodemailer не требуется.

### Публичный импорт Firebase-типа

`MailProvider` больше не импортирует `BatchResponse` из закрытого пути `firebase-admin/lib/messaging`. Тип теперь импортируется из публичного API:

```ts
import type {BatchResponse} from 'firebase-admin/messaging';
```

Версия `firebase-admin` и публичные контракты notifier-провайдеров не изменились. Если приложение самостоятельно использует внутренний Firebase-import, его рекомендуется заменить аналогичным публичным импортом.

Express и HTTP-адаптеры в `@steroidsjs/nest-notifier` не используются, поэтому переход NestJS 11 на Express 5 не требует изменений в конфигурации notifier-пакета.

## [0.5.0](../CHANGELOG.md#050-2026-07-23) (2026-07-23)

### Замена форков TypeORM на оригинальные пакеты

Пакеты `@steroidsjs/typeorm` и `@steroidsjs/nest-typeorm` больше не используются. Удалите их и установите оригинальные `typeorm` и `@nestjs/typeorm`:

```shell
yarn remove @steroidsjs/typeorm @steroidsjs/nest-typeorm
yarn add typeorm@^1.1.0 @nestjs/typeorm@^11.0.3
```

Замените импорты репозиториев и декораторов:

```ts
// До
import {Repository} from '@steroidsjs/typeorm';
import {InjectRepository} from '@steroidsjs/nest-typeorm';

// После
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
```

### Обновление Nest-зависимостей

Версии Nest-зависимостей приведены в соответствие с `@steroidsjs/nest@^5.0.0-beta.1`:

```shell
yarn add @nestjs/common@^10.4.19 \
  @nestjs/typeorm@^11.0.3 \
  @steroidsjs/nest@^5.0.0-beta.1 \
  @steroidsjs/nest-modules@^0.1.6
```

Если проект использует пакеты для схем или тестирования, обновите и их:

```shell
yarn add --dev @nestjs/schematics@^10.2.3 @nestjs/testing@^10.4.19
```

## [0.4.0](../CHANGELOG.md#040-2025-12-26) (2025-12-26)

### Провайдеры не подключены в модуль по-умолчанию

Теперь провайдеры не подключены в модуль по-умолчанию. Необходимо самостоятельно подключить в проекте нужные провайдеры и определить в DI контейнере
по токену NOTIFIER_PROVIDERS_LIST их массив

До
```ts
@Module({
    ...coreModule,
    tables,
    module: (config) => {
        const module = coreModule.module(config) as any;
        return {
            imports: [],
            providers: [
                ...(module.providers || []),
            ],
            exports: [],
        };
    },
})
export class NotifierModule {}
```

После
```ts
@Module({
    ...coreModule,
    tables,
    module: (config) => {
        const module = coreModule.module(config) as any;
        return {
            imports: [],
            providers: [
                ...(module.providers || []),
                SmscCallProvider,
                SmscSmsProvider,

                {
                    provide: NOTIFIER_PROVIDERS_LIST,
                    inject: [
                        SmscCallProvider,
                        SmscSmsProvider,
                    ],
                    useFactory: (...providers: INotifierProvider[]) => providers,
                },
            ],
            exports: [],
        };
    },
})
export class NotifierModule {}
```
