import {INotifierMailAttachment} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';

export const IMailService = 'IMailService';

export interface IMailService {
    sendEmail(fromEmail: string, toEmail:string, message:string, attachments: INotifierMailAttachment[]);
}
