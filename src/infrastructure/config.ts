import * as process from 'process';

interface IProviderConfig {
    activeProvider?: string,
    [providerName: string]: any,
}

export interface INotifierModuleConfig {
    providers?: {
        mail?: IProviderConfig,
        sms?: IProviderConfig,
        call?: IProviderConfig,
        voice?: IProviderConfig,
        push?: IProviderConfig,
    },
}

export default () => ({
    providers: {
        mail: {
            activeProvider: process.env.NOTIFIER_ACTIVE_MAIL_PROVIDER || 'mail',
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
