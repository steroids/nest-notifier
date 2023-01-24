export default class NotifierProviderNotFoundException extends Error {
    constructor(name, type) {
        const message = `Notifier module: provider is not found. Name - ${name}, type - ${type}`;
        super(message);
    }
}
