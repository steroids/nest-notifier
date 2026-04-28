import {Module} from '@nestjs/common';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {SmsRuCallProvider} from './providers/SmsRuCallProvider';

@Module({
    imports: [
        NotifierCoreModule,
    ],
    providers: [
        SmsRuCallProvider,
    ],
    exports: [
        SmsRuCallProvider,
    ],
})
export class SmsRuCallProviderModule {}
