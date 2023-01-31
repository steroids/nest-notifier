export interface INotifierModuleConfig {
    providers?: Record<string, any>,
}

export default () => ({
    providers: {
        smsRu: {
            apiId: process.env.NOTIFIER_SMS_RU_API_ID,
        },
        smsc: {
            login: process.env.NOTIFIER_SMSC_LOGIN,
            password: process.env.NOTIFIER_SMSC_PASSWORD,
        },
    },
} as INotifierModuleConfig);
