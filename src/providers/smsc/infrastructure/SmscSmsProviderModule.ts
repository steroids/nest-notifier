import {Module} from '@nestjs/common';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {SmscSmsProvider} from './providers/SmscSmsProvider';

@Module({
    imports: [
        NotifierCoreModule,
    ],
    providers: [
        SmscSmsProvider,
    ],
    exports: [
        SmscSmsProvider,
    ],
})
export class SmscSmsProviderModule {}
