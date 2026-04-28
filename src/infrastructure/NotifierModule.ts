import {Module as NestModule} from '@nestjs/common';
import createNotifierModule, {ICreateNotifierModuleOptions} from './createNotifierModule';

@NestModule({})
export class NotifierModule {
    static registerAsync(options: ICreateNotifierModuleOptions) {
        return createNotifierModule(options, NotifierModule);
    }
}
