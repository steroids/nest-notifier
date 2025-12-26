# Steroids Nest Notifier Migration Guide

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
