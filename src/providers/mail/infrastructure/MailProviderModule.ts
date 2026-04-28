import {Module} from '@nestjs/common';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {IMailService} from '../domain/interfaces/IMailService';
import {MailProvider} from './providers/MailProvider';
import {MailService} from './services/MailService';

@Module({
    imports: [
        NotifierCoreModule,
    ],
    providers: [
        {
            provide: IMailService,
            useClass: MailService,
        },
        MailProvider,
    ],
    exports: [
        MailProvider,
    ],
})
export class MailProviderModule {}
