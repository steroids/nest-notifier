# Steroids Nest Notifier Migration Guide

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
    tables: [
        ...ModuleHelper.importDir(__dirname + '/tables'),
    ],
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
    tables: [
        ...ModuleHelper.importDir(__dirname + '/tables'),
    ],
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
