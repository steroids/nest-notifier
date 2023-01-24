import {
    CreateTimeField,
    EnumField,
    PrimaryKeyField,
    RelationField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import NotifierProviderType from '@steroidsjs/nest-modules/notifier/enums/NotifierProviderType';
import {NotifierStatusEnum} from '../enums/NotifierStatusEnum';
import {NotifierSendPushLogModel} from './NotifierSendPushLogModel';

export class NotifierSendLogModel {
    @PrimaryKeyField()
    id: number;

    @EnumField({
        enum: NotifierProviderType,
    })
    provider: string;

    @EnumField({
        enum: NotifierStatusEnum,
    })
    status: string;

    @RelationField({
        type: 'OneToOne',
        isOwningSide: false,
        inverseSide: (log: NotifierSendPushLogModel) => log.sendLog,
        relationClass: () => NotifierSendPushLogModel,
    })
    sendPushLog: NotifierSendPushLogModel;

    @CreateTimeField()
    createTime: string;
}
