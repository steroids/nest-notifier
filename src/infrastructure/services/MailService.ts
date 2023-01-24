import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {IMailService} from '../../domain/interfaces/IMailService';

@Injectable()
export default class MailService implements IMailService {
    constructor(private mailerService: MailerService) {
    }

    sendEmail(fromEmail, toEmail, message, attachments) {
        this.mailerService
            .sendMail({
                to: toEmail, // list of receivers
                from: fromEmail, // sender address
                text: message, // sender address
                subject: message, // Subject line
                html: '<p>' + message + '</p>',
            })
            .then(() => {
            })
            .catch((e) => {
                console.log(e);
            });
    }
}
