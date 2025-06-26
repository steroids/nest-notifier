import {
    INotifierSendOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {Inject} from '@nestjs/common';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {INotifierProvider} from '../interfaces/INotifierProvider';
import NotifierProviderCollisionException from '../exceptions/NotifierProviderCollisionException';
import NotifierProviderNotFoundException from '../exceptions/NotifierProviderNotFoundException';
import {INotifierProviderService} from '../interfaces/INotifierProviderService';
import {NotifierSendRequestSaveDto} from '../dtos/NotifierSendRequestSaveDto';
import NotifierProviderNotSpecifiedException from '../exceptions/NotifierProviderNotSpecifiedException';
import {NotifierProvidersToken} from '../providers';
import {NotifierSendRequestService} from './NotifierSendRequestService';

export class NotifierService implements INotifierService {
    constructor(
        @Inject(INotifierProviderService)
        protected readonly providerService: INotifierProviderService,
        @Inject(NotifierSendRequestService)
        protected readonly sendRequestService: NotifierSendRequestService,
        @Inject(NotifierProvidersToken)
        public providers: INotifierProvider[],
    ) {}

    public async send(options: INotifierSendOptions): Promise<{
        sms?: any,
        call?: any,
        mail?: any,
        push?: any,
        voice?: any,
        sendRequestId: number,
    }> {
        const typesMap = {
            sms: NotifierProviderType.SMS,
            call: NotifierProviderType.CALL,
            mail: NotifierProviderType.MAIL,
            push: NotifierProviderType.PUSH,
            voice: NotifierProviderType.VOICE,
        };
        const sendRequest = await this.sendRequestService.create(
            new NotifierSendRequestSaveDto(),
        );

        const response = {
            sendRequestId: sendRequest.id,
        };
        for (const type in typesMap) {
            if (options[type]) {
                const providerType = typesMap[type];
                const providerOptions = options[type];

                /*
                    Determine the name of the provider. It can be passed directly to the providerName field
                    or obtained using the providerService
                 */
                let providerName = providerOptions.providerName || null;
                if (!providerName) {
                    providerName = await this.providerService.getActiveProviderName(providerType);
                }
                if (!providerName) {
                    throw new NotifierProviderNotSpecifiedException(providerType);
                }

                /*
                    Looking for providers by providerName. If there are several providers with the required name,
                     throw an exception
                 */
                const providers = this.providers.filter(provider => (
                    provider.name === providerName && provider.type === providerType
                ));
                if (providers.length > 1) {
                    throw new NotifierProviderCollisionException(providerName, providerType);
                }
                if (providers.length === 0) {
                    throw new NotifierProviderNotFoundException(providerName, providerType);
                }

                const provider = providers[0];
                response[type] = await provider.send({
                    sendRequestId: sendRequest.id,
                    ...providerOptions,
                });
            }
        }
        return response;
    }
}
