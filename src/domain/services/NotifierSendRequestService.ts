import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {SearchResultDto} from '@steroidsjs/nest/usecases/dtos/SearchResultDto';
import {Inject, Injectable, Type} from '@nestjs/common';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {INotifierSendRequestRepository} from '../interfaces/INotifierSendRequestRepository';
import {NotifierSendRequestSaveDto} from '../dtos/NotifierSendRequestSaveDto';
import {NotifierSendRequestSearchDto} from '../dtos/NotifierSendRequestSearchDto';
import {NotifierSendRequestModel} from '../models/NotifierSendRequestModel';

@Injectable()
export class NotifierSendRequestService extends CrudService<
    NotifierSendRequestModel,
    NotifierSendRequestSearchDto,
    NotifierSendRequestSaveDto> {
    protected modelClass = NotifierSendRequestModel;

    constructor(
        /** NotifierSendRequestRepository */
        @Inject(INotifierSendRequestRepository)
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
        await ValidationHelper.validate(dto);

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
        // @ts-ignore
        return result;
    }
}
