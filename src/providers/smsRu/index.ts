import {INotifierProviderModule} from '../../domain/interfaces/INotifierProviderModule';
import {SmsRuCallProviderModule} from './infrastructure/SmsRuCallProviderModule';
import {SmsRuSmsProviderModule} from './infrastructure/SmsRuSmsProviderModule';
import {SmsRuCallProvider} from './infrastructure/providers/SmsRuCallProvider';
import {SmsRuSmsProvider} from './infrastructure/providers/SmsRuSmsProvider';

/**
 * Провайдер для отправки SMS через SmsRu.
 */
export const smsRuSmsProviderModule: INotifierProviderModule = {
    module: SmsRuSmsProviderModule,
    notifierProviders: [
        SmsRuSmsProvider,
    ],
};

/**
 * Провайдер для отправки звонков через SmsRu.
 */
export const smsRuCallProviderModule: INotifierProviderModule = {
    module: SmsRuCallProviderModule,
    notifierProviders: [
        SmsRuCallProvider,
    ],
};
