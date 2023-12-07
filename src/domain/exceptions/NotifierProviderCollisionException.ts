export default class NotifierProviderCollisionException extends Error {
    constructor(providerName: string, providerType: string) {
        const message = `Several providers of a "${providerType}" type and "${providerName}" name is included in config`;

        super(message);
    }
}
