import {Module} from '@nestjs/common';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {SmscVoiceMessageProvider} from './providers/SmscVoiceMessageProvider';

@Module({
    imports: [
        NotifierCoreModule,
    ],
    providers: [
        SmscVoiceMessageProvider,
    ],
    exports: [
        SmscVoiceMessageProvider,
    ],
})
export class SmscVoiceMessageProviderModule {}
