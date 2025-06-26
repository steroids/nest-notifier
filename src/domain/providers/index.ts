import {INotifierModuleConfig} from '../../infrastructure/config';
import {SmscCallProvider} from './SmscCallProvider';
import {SmscSmsProvider} from './SmscSmsProvider';
import {SmscVoiceMessageProvider} from './SmscVoiceMessageProvider';
import {SmsRuCallProvider} from './SmsRuCallProvider';
import {SmsRuSmsProvider} from './SmsRuSmsProvider';
import {MailProvider} from './MailProvider';

export const getNotifierProviders = (config: INotifierModuleConfig) => [
    SmscCallProvider,
    SmscSmsProvider,
    SmscVoiceMessageProvider,
    SmsRuCallProvider,
    SmsRuSmsProvider,
    ...(config.providers.mail.host ? [MailProvider] : []),
];

export const NotifierProvidersToken = 'NotifierProvidersToken';
