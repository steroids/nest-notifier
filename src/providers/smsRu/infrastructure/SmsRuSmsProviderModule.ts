import {Module} from '@nestjs/common';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {SmsRuSmsProvider} from './providers/SmsRuSmsProvider';

@Module({
    imports: [
        NotifierCoreModule,
    ],
    providers: [
        SmsRuSmsProvider,
    ],
    exports: [
        SmsRuSmsProvider,
    ],
})
export class SmsRuSmsProviderModule {}
