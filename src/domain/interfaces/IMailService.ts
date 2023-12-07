import {
    INotifierMailOptions,
} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';

export const IMailService = 'IMailService';

export interface IMailService {
    sendEmail(options: INotifierMailOptions): Promise<any>;
}
