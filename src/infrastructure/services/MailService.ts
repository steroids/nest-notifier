import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {INotifierMailOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {IMailService} from '../../domain/interfaces/IMailService';

@Injectable()
export default class MailService implements IMailService {
    constructor(private mailerService: MailerService) {
    }

    sendEmail(options: INotifierMailOptions) {
        return this.mailerService.sendMail(options);
    }
}
