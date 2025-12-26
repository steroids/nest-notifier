import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {SearchResultDto} from '@steroidsjs/nest/usecases/dtos/SearchResultDto';
import {Inject, Injectable, Type} from '@nestjs/common';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {INotifierSendLogRepository} from '../interfaces/INotifierSendLogRepository';
import {NotifierSendLogModel} from '../models/NotifierSendLogModel';
import {NotifierSendLogSaveDto} from '../dtos/NotifierSendLogSaveDto';
import {NotifierSendLogSearchDto} from '../dtos/NotifierSendLogSearchDto';

@Injectable()
export class NotifierSendLogService extends CrudService<
    NotifierSendLogModel,
    NotifierSendLogSearchDto,
    NotifierSendLogSaveDto> {
    protected modelClass = NotifierSendLogModel;

    constructor(
        /** NotifierSendLogRepository */
        @Inject(INotifierSendLogRepository)
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
        await ValidationHelper.validate(dto);

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
