export default class NotifierProviderCollisionException extends Error {
    constructor(providerType: string) {
        const message = `Several providers of a "${providerType}" type is included in config, 
            name is required to distinguish a specific provider`;

        super(message);
    }
}
