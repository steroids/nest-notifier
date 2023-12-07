export default class NotifierProviderNotSpecifiedException extends Error {
    constructor(type: string) {
        const message = `Notifier provider for type=${type} not specified. You can specify it in the config `
            + 'or in the providerName field when calling the send method.';
        super(message);
    }
}
