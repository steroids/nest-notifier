import {INotifierBaseOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';

export interface INotifierProvider {
    type: string;
    name: string;
    send: (options: INotifierBaseOptions) => Promise<string|void|object>;
}
