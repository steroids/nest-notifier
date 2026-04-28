# Steroids Nest Notifier Migration Guide

## Next

### `NotifierModule.registerAsync()` теперь подключается как Nest DynamicModule

Раньше модуль часто подключался через spread конфигурации `@steroidsjs/nest-notifier` и ручное расширение `providers`/`exports`.
Теперь проект должен импортировать `CoreNotifierModule.registerAsync(...)` как обычный Nest module.

До
```ts
import {Module} from '@steroidsjs/nest/infrastructure/decorators/Module';
import coreModule from '@steroidsjs/nest-notifier';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {NOTIFIER_PROVIDERS_LIST} from '@steroidsjs/nest-notifier/domain/interfaces/INotifierProvidersList';
import {INotifierProvider} from '@steroidsjs/nest-notifier/domain/interfaces/INotifierProvider';
import {notifierProviders} from 'src/notifier/domain/providers';

@Module({
    ...coreModule,
    module: (config) => {
        const module = coreModule.module(config) as any;

        return {
            ...module,
            providers: [
                ...(module.providers || []),
                ...notifierProviders,
                {
                    provide: NOTIFIER_PROVIDERS_LIST,
                    inject: notifierProviders,
                    useFactory: (...providers: INotifierProvider[]) => providers,
                },
            ],
            exports: [
                INotifierService,
            ],
        };
    },
})
export class NotifierModule {}
```

После
```ts
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

### Добавьте `migrationsModuleName`

`migrationsModuleName` обязателен для проектов, которые генерируют миграции через `@steroidsjs/nest`.
Он должен совпадать с именем локального модуля проекта, куда генератор должен положить миграции.

Например, если модуль проекта расположен в `src/notifier`, используйте:

```ts
const NOTIFIER_MIGRATIONS_MODULE_NAME = 'notifier';

CoreNotifierModule.registerAsync({
    migrationsModuleName: NOTIFIER_MIGRATIONS_MODULE_NAME,
    providerModules: [
        firebasePushProviderModule,
    ],
})
```

Без этой опции таблицы из `nest-notifier` и подключенных provider-модулей могут попасть в TypeORM metadata,
но генератор миграций не сможет сопоставить их с модулем проекта и выдаст ошибку:

```text
[ERROR!] Not found info for table: <table_name>
```

### Подключайте провайдеры через `providerModules`

Провайдеры больше не нужно вручную добавлять в `providers` и собирать массив `NOTIFIER_PROVIDERS_LIST`.
Каждый провайдер должен быть описан как `INotifierProviderModule`.

```ts
import {Module} from '@nestjs/common';
import {INotifierProviderModule} from '@steroidsjs/nest-notifier/domain/interfaces/INotifierProviderModule';
import {LocalPushProvider} from '../providers/LocalPushProvider';

@Module({
    providers: [
        LocalPushProvider,
    ],
    exports: [
        LocalPushProvider,
    ],
})
export class LocalPushProviderModule {}

export const localPushProviderModule: INotifierProviderModule = {
    module: LocalPushProviderModule,
    notifierProviders: [
        LocalPushProvider,
    ],
};
```

Если у provider-модуля есть свои таблицы, укажите их в descriptor:

```ts
export const localPushProviderModule: INotifierProviderModule = {
    module: LocalPushProviderModule,
    tables: [
        LocalPushTokenTable,
    ],
    notifierProviders: [
        LocalPushProvider,
    ],
};
```

После этого передайте descriptor в `providerModules`.

## [0.4.0](../CHANGELOG.md#400-2025-12-26) (2025-12-26)

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
