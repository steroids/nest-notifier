import {Type} from '@nestjs/common';
import {INotifierProvider} from './INotifierProvider';

export interface INotifierProviderModule {
    module: any,
    tables?: Function[],
    notifierProviders?: Type<INotifierProvider>[],
}
