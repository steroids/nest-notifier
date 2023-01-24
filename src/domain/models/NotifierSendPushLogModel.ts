import {
    PrimaryKeyField,
    RelationField,
    RelationIdField,
    StringField,
} from '@steroidsjs/nest/infrastructure/decorators/fields';
import {NotifierSendLogModel} from './NotifierSendLogModel';

export class NotifierSendPushLogModel {
    @PrimaryKeyField()
    id: number;

    @RelationField({
        type: 'OneToOne',
        isOwningSide: true,
        relationClass: () => NotifierSendLogModel,
    })
    sendLog: NotifierSendLogModel;

    @RelationIdField({
        relationName: 'sendLog',
    })
    sendLogId: number;

    @StringField({
        nullable: true,
    })
    messageId: string;

    @StringField({
        nullable: true,
    })
    errorCode: string;

    @StringField({
        nullable: true,
    })
    errorMessage: string;
}
