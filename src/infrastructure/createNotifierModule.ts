import {DynamicModule, Type} from '@nestjs/common';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {
    INotifierProvidersList,
    NOTIFIER_PROVIDERS_LIST,
} from '../domain/interfaces/INotifierProvidersList';
import {INotifierProviderModule} from '../domain/interfaces/INotifierProviderModule';
import {INotifierProvider} from '../domain/interfaces/INotifierProvider';
import {NotifierService} from '../domain/services/NotifierService';
import config from './config';
import {NotifierCoreModule} from './NotifierCoreModule';
import tables from './tables';

export interface ICreateNotifierModuleOptions {
    migrationsModuleName: string,
    providerModules?: INotifierProviderModule[],
}

const uniqueByReference = <T>(items: T[]): T[] => items.filter((item, index) => items.indexOf(item) === index);

export const createNotifierModule = (
    options: ICreateNotifierModuleOptions,
    moduleClass: Type<any> = NotifierModule,
): DynamicModule => {
    const providerModules = options.providerModules || [];
    const providerTables = uniqueByReference(providerModules.flatMap(providerModule => providerModule.tables || []));
    const moduleTables = uniqueByReference([
        ...tables,
        ...providerTables,
    ]);
    const notifierProviders = uniqueByReference(
        providerModules.flatMap(providerModule => providerModule.notifierProviders || []),
    );

    ModuleHelper.addEntities(moduleTables, options.migrationsModuleName);
    ModuleHelper.setConfig(NotifierModule, config);

    return {
        module: moduleClass,
        imports: [
            NotifierCoreModule,
            ...uniqueByReference(providerModules.map(providerModule => providerModule.module)),
        ],
        providers: [
            {
                provide: INotifierService,
                useClass: NotifierService,
            },

            {
                provide: NOTIFIER_PROVIDERS_LIST,
                inject: notifierProviders,
                useFactory: (...providers: INotifierProvider[]): INotifierProvidersList => providers,
            },
        ],
        exports: [
            INotifierService,
        ],
    };
};

export default createNotifierModule;
