import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {SearchResultDto} from '@steroidsjs/nest/usecases/dtos/SearchResultDto';
import {Type} from '@nestjs/common';
import {validateOrReject} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {INotifierSendRequestRepository} from '../interfaces/INotifierSendRequestRepository';
import {NotifierSendRequestSaveDto} from '../dtos/NotifierSendRequestSaveDto';
import {NotifierSendRequestSearchDto} from '../dtos/NotifierSendRequestSearchDto';
import {NotifierSendRequestModel} from '../models/NotifierSendRequestModel';

export class NotifierSendRequestService extends CrudService<
    NotifierSendRequestModel,
    NotifierSendRequestSearchDto,
    NotifierSendRequestSaveDto> {
    protected modelClass = NotifierSendRequestModel;

    constructor(
        /** NotifierSendRequestRepository */
        public repository: INotifierSendRequestRepository,
    ) {
        super();
    }

    async search(dto: NotifierSendRequestSearchDto, context?: ContextDto | null)
        : Promise<SearchResultDto<NotifierSendRequestModel>>

    async search<TSchema>(
        dto: NotifierSendRequestSearchDto,
        context?: ContextDto | null,
        schemaClass?: Type<TSchema>
    ): Promise<SearchResultDto<Type<TSchema>>>

    async search<TSchema>(
        dto: NotifierSendRequestSearchDto,
        context: ContextDto = null,
        schemaClass: Type<TSchema> = null,
    ): Promise<SearchResultDto<NotifierSendRequestModel | Type<TSchema>>> {
        await validateOrReject(dto);

        const searchQuery: SearchQuery<NotifierSendRequestModel> = schemaClass
            ? SearchQuery.createFromSchema(schemaClass)
            : new SearchQuery<any>();
        searchQuery.alias('model');

        ['id'].forEach(key => {
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
                (model: NotifierSendRequestModel) => this.modelToSchema<TSchema>(model, schemaClass),
            );
        }
        return result;
    }
}
