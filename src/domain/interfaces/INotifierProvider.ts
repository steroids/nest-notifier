import { INotifierProviderOptions } from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';

export interface INotifierProvider {
    type: string;
    name: string;
    send: (options: INotifierProviderOptions) => Promise<{
        logsIds: number[],
        providerPayload: any,
    }>;
}
