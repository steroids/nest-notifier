# Steroids Nest Notifier Changelog

## [Unreleased]

[Migration guide](docs/MigrationGuide.md#unreleased)

### Changes

- Добавлена одновременная поддержка NestJS 10 и NestJS 11 в `peerDependencies` для `@nestjs/common` и `@nestjs/core`.
- Диапазон поддерживаемых версий `@nestjs-modules/mailer` обновлён до `^1.11.2 || ^2.0.0`; зависимость от Mailer отмечена как опциональная.
- Среда разработки обновлена до NestJS 11, Mailer 2 и Nodemailer 8.
- Тип `BatchResponse` теперь импортируется из публичного API `firebase-admin/messaging` вместо внутреннего модуля Firebase Admin.

## [0.5.0](https://github.com/steroids/nest-notifier/compare/0.4.0...0.5.0) (2026-07-23)

[Migration guide](docs/MigrationGuide.md#050-2026-07-23)

### Breaking changes

- Форки `@steroidsjs/typeorm` и `@steroidsjs/nest-typeorm` заменены на оригинальные пакеты `typeorm@^1.1.0` и `@nestjs/typeorm@^11.0.3`
- Nest-зависимости синхронизированы с `@steroidsjs/nest@^5.0.0-beta.1`: `@nestjs/common` обновлён до `^10.4.19`, `@nestjs/schematics` — до `^10.2.3`, `@nestjs/testing` — до `^10.4.19`
- `@steroidsjs/nest-modules` обновлён до `^0.1.6`
- `@types/node` обновлён до `^22.13.17` — минимальной поддерживаемой версии Node.js

## [0.4.0](https://github.com/steroids/nest-notifier/compare/0.3.0...0.4.0) (2025-12-26)

[Migration guide](docs/MigrationGuide.md#040-2025-12-26)

### Features

- Провайдеры не подключены в модуль по-умолчанию. NotifierService ожидает провайдеров как массив по токену NOTIFIER_PROVIDERS_LIST

### Fixes

- Nest зависимости вынесены в peerDependencies

## [0.3.0](https://github.com/steroids/nest/compare/0.2.1...0.3.0) (2025-05-12)

### Features

- Обновление Steroids до 3.2.0
