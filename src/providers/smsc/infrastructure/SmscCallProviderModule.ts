import {Module} from '@nestjs/common';
import {NotifierCoreModule} from '../../../infrastructure/NotifierCoreModule';
import {SmscCallProvider} from './providers/SmscCallProvider';

@Module({
    imports: [
        NotifierCoreModule,
    ],
    providers: [
        SmscCallProvider,
    ],
    exports: [
        SmscCallProvider,
    ],
})
export class SmscCallProviderModule {}
