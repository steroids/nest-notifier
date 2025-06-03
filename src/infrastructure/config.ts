import * as process from 'process';

interface IProviderConfig {
    activeProvider?: string,
    [providerName: string]: any,
}

interface ISmscConfig {
    smsc: {
        login: string,
        password: string,
    },
}

interface ISmsRuConfig {
    smsRu: {
        apiId: string,
    },
}

interface IMailProviderConfig extends IProviderConfig {
    host: string,
    port: number,
    sender: string,
    password: string,
    templateDir: string,
}

interface ISmsProviderConfig extends IProviderConfig, ISmscConfig, ISmsRuConfig {}

interface ICallProviderConfig extends IProviderConfig, ISmscConfig, ISmsRuConfig {}

interface IVoiceProviderConfig extends IProviderConfig, ISmscConfig {}

interface IPushProviderConfig extends IProviderConfig {}

export interface INotifierModuleConfig {
    providers?: {
        mail?: IMailProviderConfig,
        sms?: ISmsProviderConfig,
        call?: ICallProviderConfig,
        voice?: IVoiceProviderConfig,
        push?: IPushProviderConfig,
    },
}

export default () => ({
    providers: {
        mail: {
            activeProvider: process.env.NOTIFIER_ACTIVE_MAIL_PROVIDER || 'mail',
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT ?? '465', 10),
            sender: process.env.MAIL_SENDER,
            password: process.env.MAIL_PASSWORD,
            templateDir: process.env.MAIL_TEMPLATE_DIR,
        },
        sms: {
            activeProvider: process.env.NOTIFIER_ACTIVE_SMS_PROVIDER,
            smsRu: {
                apiId: process.env.NOTIFIER_SMS_RU_API_ID,
            },
            smsc: {
                login: process.env.NOTIFIER_SMSC_LOGIN,
                password: process.env.NOTIFIER_SMSC_PASSWORD,
            },
        },
        call: {
            activeProvider: process.env.NOTIFIER_ACTIVE_CALL_PROVIDER,
            smsRu: {
                apiId: process.env.NOTIFIER_SMS_RU_API_ID,
            },
            smsc: {
                login: process.env.NOTIFIER_SMSC_LOGIN,
                password: process.env.NOTIFIER_SMSC_PASSWORD,
            },
        },
        voice: {
            activeProvider: process.env.NOTIFIER_ACTIVE_VOICE_PROVIDER,
            smsc: {
                login: process.env.NOTIFIER_SMSC_LOGIN,
                password: process.env.NOTIFIER_SMSC_PASSWORD,
            },
        },
        push: {
            activeProvider: process.env.NOTIFIER_ACTIVE_PUSH_PROVIDER || 'firebase',
        },
    },
} as INotifierModuleConfig);
