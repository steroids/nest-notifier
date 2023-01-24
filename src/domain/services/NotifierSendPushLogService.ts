import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {NotifierSendPushLogSearchDto} from '../dtos/NotifierSendPushLogSearchDto';
import {NotifierSendPushLogSaveDto} from '../dtos/NotifierSendPushLogSaveDto';
import {NotifierSendPushLogModel} from '../models/NotifierSendPushLogModel';
import {INotifierSendPushLogRepository} from '../interfaces/INotifierSendPushLogRepository';

export class NotifierSendPushLogService extends CrudService<NotifierSendPushLogModel, NotifierSendPushLogSearchDto, NotifierSendPushLogSaveDto> {
    protected modelClass = NotifierSendPushLogModel;

    constructor(
        /** NotifierSendPushLogRepository */
        public repository: INotifierSendPushLogRepository,
    ) {
        super();
    }
}
