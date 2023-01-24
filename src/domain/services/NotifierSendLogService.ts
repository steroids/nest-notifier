import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {NotifierSendLogSearchDto} from '../dtos/NotifierSendLogSearchDto';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierSendLogModel} from '../models/NotifierSendLogModel';
import {INotifierSendLogRepository} from '../interfaces/INotifierSendLogRepository';

export class NotifierSendLogService extends CrudService<NotifierSendLogModel, NotifierSendLogSearchDto, NotifierSendLogSaveDto> {
    protected modelClass = NotifierSendLogModel;

    constructor(
        /** NotifierSendLogRepository */
        public repository: INotifierSendLogRepository,
    ) {
        super();
    }
}
