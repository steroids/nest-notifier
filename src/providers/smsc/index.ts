import {INotifierProviderModule} from '../../domain/interfaces/INotifierProviderModule';
import {SmscCallProviderModule} from './infrastructure/SmscCallProviderModule';
import {SmscSmsProviderModule} from './infrastructure/SmscSmsProviderModule';
import {SmscVoiceMessageProviderModule} from './infrastructure/SmscVoiceMessageProviderModule';
import {SmscCallProvider} from './infrastructure/providers/SmscCallProvider';
import {SmscSmsProvider} from './infrastructure/providers/SmscSmsProvider';
import {SmscVoiceMessageProvider} from './infrastructure/providers/SmscVoiceMessageProvider';

/**
 * Провайдер для отправки SMS через Smsc.ru.
 */
export const smscSmsProviderModule: INotifierProviderModule = {
    module: SmscSmsProviderModule,
    notifierProviders: [
        SmscSmsProvider,
    ],
};

/**
 * Провайдер для отправки звонков через Smsc.ru.
 */
export const smscCallProviderModule: INotifierProviderModule = {
    module: SmscCallProviderModule,
    notifierProviders: [
        SmscCallProvider,
    ],
};

/**
 * Провайдер для отправки голосовых сообщений через Smsc.ru.
 */
export const smscVoiceMessageProviderModule: INotifierProviderModule = {
    module: SmscVoiceMessageProviderModule,
    notifierProviders: [
        SmscVoiceMessageProvider,
    ],
};
