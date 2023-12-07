export const IProviderService = 'IProviderService';

export interface IProviderService {
    getActiveProviderName(providerType: string): Promise<string>;
}
