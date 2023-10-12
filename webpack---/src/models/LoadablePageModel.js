import Joi from 'joi'
import AbstractModel from './AbstractModel'

const getScheme = type => ({
    isLoading: Joi.boolean().required(),
    isLoaded: Joi.boolean().required(),
    pagination: Joi.object().keys({
        total: Joi.number().required(),
        limit: Joi.number().default(12),
        offset: Joi.number().default(0),
    }).required(),
    values: Joi.array().items(Joi.object().instance(type)),
})

/**
 * @deprecated duplicate models-ts/LoadablePageModel.ts
 */
class LoadablePageModel extends AbstractModel {
    constructor(type, data = {
        isLoading: true,
        isLoaded: false,
        pagination: {
            total: 0
        },
        values: []
    }) {
        super(data, getScheme(type))
    }

    loaded({
        pagination,
        values
    }) {
        this.values = values || []
        this.pagination = pagination
        this.isLoaded = true
        this.isLoading = false
    }

    loadMore({
        pagination,
        values
    }) {
        this.values = this.values.concat(values)
        this.pagination = pagination
        this.isLoaded = true
        this.isLoading = false
    }

    loading() {
        this.isLoading = true
    }
}

export default LoadablePageModel