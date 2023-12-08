export const INotifierProviderService = 'INotifierProviderService';

export interface INotifierProviderService {
    getActiveProviderName(providerType: string): Promise<string>;
}
