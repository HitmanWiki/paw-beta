import Joi from 'joi'
import uniqueId from 'lodash/uniqueId'
import AbstractModel from './AbstractModel'
import Deferred from 'promise-deferred'

let deferredes = {}

const getScheme = type => ({
    uniqueId: Joi.string().default(uniqueId()),
    isLoading: Joi.boolean().required(),
    isLoaded: Joi.boolean().required(),
    value: Joi.alternatives().try(Joi.object().instance(type), Joi.array()).allow(null),
})

class LoadableModel extends AbstractModel {
    constructor(type, data = {
        isLoading: true,
        isLoaded: false,
        value: null
    }) {
        super(data, getScheme(type))
    }

    loaded(value) {
        this.value = value
        this.isLoaded = true
        this.isLoading = false
        if (deferredes[this.uniqueId]) {
            deferredes[this.uniqueId].resolve()
        }
    }

    loading() {
        this.isLoading = true
    }

    async awaitModelLoad() {
        if (!this.value) {
            deferredes[this.uniqueId] = new Deferred()
            await deferredes[this.uniqueId].promise
            deferredes[this.uniqueId] = null
        }
    }

    reject(defaultValue) {
        this.isLoading = false
        this.isLoaded = false
        if (defaultValue) {
            this.value = defaultValue
        }
    }
}

export default LoadableModel