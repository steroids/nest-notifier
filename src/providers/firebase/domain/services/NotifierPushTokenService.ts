import {CrudService} from '@steroidsjs/nest/usecases/services/CrudService';
import {ContextDto} from '@steroidsjs/nest/usecases/dtos/ContextDto';
import {SearchResultDto} from '@steroidsjs/nest/usecases/dtos/SearchResultDto';
import {Inject, Injectable, Type} from '@nestjs/common';
import SearchQuery from '@steroidsjs/nest/usecases/base/SearchQuery';
import {ValidationHelper} from '@steroidsjs/nest/usecases/helpers/ValidationHelper';
import {INotifierPushTokenRepository} from '../interfaces/INotifierPushTokenRepository';
import {NotifierPushTokenModel} from '../models/NotifierPushTokenModel';
import {NotifierPushTokenSaveDto} from '../dtos/NotifierPushTokenSaveDto';
import {NotifierPushTokenSearchDto} from '../dtos/NotifierPushTokenSearchDto';

@Injectable()
export class NotifierPushTokenService extends CrudService<
    NotifierPushTokenModel,
    NotifierPushTokenSearchDto,
    NotifierPushTokenSaveDto> {
    protected modelClass = NotifierPushTokenModel;

    constructor(
        /** NotifierPushTokenRepository */
        @Inject(INotifierPushTokenRepository)
        public repository: INotifierPushTokenRepository,
    ) {
        super();
    }

    async search(dto: NotifierPushTokenSearchDto, context?: ContextDto | null)
        : Promise<SearchResultDto<NotifierPushTokenModel>>

    async search<TSchema>(
        dto: NotifierPushTokenSearchDto,
        context?: ContextDto | null,
        schemaClass?: Type<TSchema>
    ): Promise<SearchResultDto<TSchema>>

    async search<TSchema>(
        dto: NotifierPushTokenSearchDto,
        context: ContextDto = null,
        schemaClass: Type<TSchema> = null,
    ): Promise<SearchResultDto<NotifierPushTokenModel | TSchema>> {
        await ValidationHelper.validate(dto);

        const searchQuery: SearchQuery<NotifierPushTokenModel> = schemaClass
            ? SearchQuery.createFromSchema(schemaClass)
            : new SearchQuery<any>();
        searchQuery.alias('model');

        ['id', 'userId', 'token', 'platform', 'providerName'].forEach(key => {
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
                (model: NotifierPushTokenModel) => this.modelToSchema<TSchema>(model, schemaClass),
            );
        }

        return result;
    }

    async findTokensByUserId(userId: string, providerName: string = null): Promise<string[]> {
        const dto = new NotifierPushTokenSearchDto();
        dto.userId = userId;
        dto.providerName = providerName;

        const result = await this.search(dto);
        return result.items.map(item => item.token);
    }
}
