import {MailerService} from '@nestjs-modules/mailer';
import {Injectable, Optional} from '@nestjs/common';
import {INotifierMailOptions} from '@steroidsjs/nest-modules/notifier/interfaces/INotifierSendOptions';
import {IMailService} from '../../domain/interfaces/IMailService';

@Injectable()
export default class MailService implements IMailService {
    constructor(
        @Optional()
        private mailerService: MailerService,
    ) {
    }

    sendEmail(options: INotifierMailOptions) {
        if (!this.mailerService) {
            throw new Error('MailerModule is not configured');
        }
        return this.mailerService.sendMail(options);
    }
}
