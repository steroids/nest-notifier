import {
    INotifierBaseOptions,
    INotifierSendOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import NotifierProviderCollisionException from '../exceptions/NotifierProviderCollisionException';
import NotifierProviderNotFoundException from '../exceptions/NotifierProviderNotFoundException';

export class NotifierService {
    constructor(
        public providers: INotifierProvider[],
    ) {}

    async send(options: INotifierSendOptions) {
        const typesMap = {
            sms: NotifierProviderType.SMS,
            call: NotifierProviderType.CALL,
            mail: NotifierProviderType.MAIL,
            store: NotifierProviderType.STORE,
            push: NotifierProviderType.PUSH,
            voice: NotifierProviderType.VOICE,
        };
        const response: {
            sms?: any,
            call?: any,
            mail?: any,
            store?: any,
            push?: any,
            voice?: any,
        } = {};
        const baseOptions: INotifierBaseOptions = Object.keys(options)
            .reduce((obj, key) => {
                if (!Object.keys(typesMap)
                    .includes(key) && key !== 'providers') {
                    obj[key] = options[key];
                }
                return obj;
            }, {});

        for (const type in typesMap) {
            if (options[type]) {
                const providerType = typesMap[type];
                const providerOptions = {
                    ...baseOptions,
                    ...(typeof options[type] === 'object' ? options[type] : null),
                };

                const providerName = providerOptions.name || null;

                // Находим доступные по этому типу провайдеры
                const providersByType = this.providers.filter(provider => provider.type === providerType);
                if (providersByType.length > 1 && !providerName) {
                    throw new NotifierProviderCollisionException(providerType);
                }

                // Находим провайдер или по имени, или берем первый из доступных
                const provider = providerName && providersByType.length > 1
                    ? providersByType.find(providerItem => providerItem.name === providerName)
                    : providersByType.pop();
                if (!provider) {
                    throw new NotifierProviderNotFoundException(providerName, providerType);
                }

                response[type] = await provider.send(providerOptions);
            }
        }
        return response;
    }
}
