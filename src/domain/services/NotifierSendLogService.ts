import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {SearchResultDto} from '@steroidsjs/nest/usecases/dtos/SearchResultDto';
import {Type} from '@nestjs/common';
import {validateOrReject} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {INotifierSendLogRepository} from '../interfaces/INotifierSendLogRepository';
import {NotifierSendLogModel} from '../models/NotifierSendLogModel';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierSendLogSearchDto} from '../dtos/NotifierSendLogSearchDto';

export class NotifierSendLogService extends CrudService<
    NotifierSendLogModel,
    NotifierSendLogSearchDto,
    NotifierSendLogSaveDto> {
    protected modelClass = NotifierSendLogModel;

    constructor(
        /** NotifierSendLogRepository */
        public repository: INotifierSendLogRepository,
    ) {
        super();
    }

    async search(dto: NotifierSendLogSearchDto, context?: ContextDto | null)
        : Promise<SearchResultDto<NotifierSendLogModel>>

    async search<TSchema>(
        dto: NotifierSendLogSearchDto,
        context?: ContextDto | null,
        schemaClass?: Type<TSchema>
    ): Promise<SearchResultDto<Type<TSchema>>>

    async search<TSchema>(
        dto: NotifierSendLogSearchDto,
        context: ContextDto = null,
        schemaClass: Type<TSchema> = null,
    ): Promise<SearchResultDto<NotifierSendLogModel | Type<TSchema>>> {
        await validateOrReject(dto);

        const searchQuery: SearchQuery<NotifierSendLogModel> = schemaClass
            ? SearchQuery.createFromSchema(schemaClass)
            : new SearchQuery<any>();
        searchQuery.alias('model');

        ['id', 'sendRequestId', 'providerType', 'providerName', 'status', 'receiver', 'errorMessage'].forEach(key => {
            if (dto[key]) {
                searchQuery.andWhere(['=', key, dto[key]]);
            }
        });

        const result = await this.repository.search<TSchema>(
            dto,
            searchQuery,
        );
        if (schemaClass) {
            result.items = result.items.map(
                (model: NotifierSendLogModel) => this.modelToSchema<TSchema>(model, schemaClass),
            );
        }
        // @ts-ignore
        return result;
    }
}
