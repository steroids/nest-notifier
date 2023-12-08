import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {NotifierModule} from '@steroidsjs/nest-modules/notifier/NotifierModule';
import {INotifierModuleConfig} from '../../infrastructure/config';
import {INotifierProviderService} from '../interfaces/INotifierProviderService';

export class NotifierProviderService implements INotifierProviderService {
    public async getActiveProviderName(providerType: string) {
        const config = ModuleHelper.getConfig<INotifierModuleConfig>(NotifierModule)?.providers;
        const providerName = config[providerType].activeProvider;
        if (!providerName) {
            throw new Error('Wrong provider type');
        }
        return providerName;
    }
}
