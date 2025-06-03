import {ModuleHelper} from '@steroidsjs/nest/infrastructure/helpers/ModuleHelper';
import {INotifierService} from '@steroidsjs/nest-modules/notifier/services/INotifierService';
import {NotifierSendLogService} from '../domain/services/NotifierSendLogService';
import {NotifierSendPushLogService} from '../domain/services/NotifierSendPushLogService';
import {INotifierSendLogRepository} from '../domain/interfaces/INotifierSendLogRepository';
import {NotifierSendLogRepository} from './repositories/NotifierSendLogRepository';
import {INotifierSendPushLogRepository} from '../domain/interfaces/INotifierSendPushLogRepository';
import {NotifierSendPushLogRepository} from './repositories/NotifierSendPushLogRepository';
import {INotifierModuleConfig} from './config';
import {INotifierSendRequestRepository} from '../domain/interfaces/INotifierSendRequestRepository';
import { NotifierSendRequestRepository } from './repositories/NotifierSendRequestRepository';
import {NotifierSendRequestService} from '../domain/services/NotifierSendRequestService';
import {SmscCallProvider} from '../domain/providers/SmscCallProvider';
import {SmscSmsProvider} from '../domain/providers/SmscSmsProvider';
import {SmscVoiceMessageProvider} from '../domain/providers/SmscVoiceMessageProvider';
import {SmsRuCallProvider} from '../domain/providers/SmsRuCallProvider';
import {SmsRuSmsProvider} from '../domain/providers/SmsRuSmsProvider';
import {INotifierProviderService} from '../domain/interfaces/INotifierProviderService';
import {NotifierService} from '../domain/services/NotifierService';
import {NotifierProviderService} from '../domain/services/NotifierProviderService';
import {IMailService} from "../domain/interfaces/IMailService";
import MailService from "./services/MailService";
import {MailProvider} from "../domain/providers/MailProvider";
import {ModuleMetadata} from "@nestjs/common";
import {MailerModule} from "@nestjs-modules/mailer";
import {PugAdapter} from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

export default (config: INotifierModuleConfig) => ({
    imports: [
        config.providers.mail.host && MailerModule.forRoot({
            transport: {
                host: config.providers.mail.host,
                port: config.providers.mail.port,
                secure: true,
                auth: {
                    user: config.providers.mail.sender,
                    pass: config.providers.mail.password,
                },
            },
            defaults: {
                from: config.providers.mail.sender,
            },
            ...(
                config.providers.mail.templateDir && {
                    template: {
                        dir: config.providers.mail.templateDir,
                        adapter: new PugAdapter(),
                        options: {
                            strict: true
                        },
                    },
                }
            ),
        }),
    ].filter(Boolean),
    providers: [
        {
            provide: INotifierSendRequestRepository,
            useClass: NotifierSendRequestRepository,
        },
        {
            provide: INotifierSendLogRepository,
            useClass: NotifierSendLogRepository,
        },
        {
            provide: INotifierSendPushLogRepository,
            useClass: NotifierSendPushLogRepository,
        },
        {
            provide: IMailService,
            useClass: MailService,
        },
        ModuleHelper.provide(NotifierSendRequestService, [
            INotifierSendRequestRepository,
        ]),
        ModuleHelper.provide(NotifierSendLogService, [
            INotifierSendLogRepository,
        ]),
        ModuleHelper.provide(NotifierSendPushLogService, [
            INotifierSendPushLogRepository,
        ]),

        // Providers
        ModuleHelper.provide(SmscCallProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmscSmsProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmscVoiceMessageProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmsRuCallProvider, [
            NotifierSendLogService,
        ]),
        ModuleHelper.provide(SmsRuSmsProvider, [
            NotifierSendLogService,
        ]),
        MailProvider,

        // Services
        {
            provide: INotifierProviderService,
            useClass: NotifierProviderService,
        },
        ModuleHelper.provide(NotifierService, INotifierService, [
            INotifierProviderService,
            NotifierSendRequestService,
            [
                SmscCallProvider,
                SmscSmsProvider,
                SmscVoiceMessageProvider,
                SmsRuCallProvider,
                SmsRuSmsProvider,
                config.providers.mail.host && MailProvider,
            ].filter(Boolean),
        ]),
    ],
    exports: [
        INotifierService,
    ],
}) as ModuleMetadata;
