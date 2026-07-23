# Steroids Nest Notifier Changelog

## Unreleased

[Migration guide](docs/MigrationGuide.md#unreleased)

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
