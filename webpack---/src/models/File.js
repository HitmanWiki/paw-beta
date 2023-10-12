import Joi from 'joi'
import {
    CAT_IMG_ORIGINAL
} from '@/constants/file'
import {
    getUrl
} from '@/utils/file'
import AbstractModel from './AbstractModel'
import {
    parseJson
} from '@/utils/parser'

/**
 * @deprecated duplicate models-ts/File.ts
 */
class File extends AbstractModel {
    static propTypes = {
        id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        created_at: Joi.string(), // Nigga, don't use a empty string here by default
        name: Joi.string().default('').required(),
        filename: Joi.string().default('').required(),
        ext: Joi.string().default(''),
        source: Joi.string().default('').required(),
        path: Joi.string().default('').required(),
        description: Joi.string().default('').allow('', null),
        category: Joi.number().default(CAT_IMG_ORIGINAL),
        meta: Joi.any(),
    }

    static fromServer(data) {
        return new File({
            ...data,
            category: data.category || CAT_IMG_ORIGINAL,
        })
    }

    get src() {
        return getUrl(this)
    }

    get parsedMeta() {
        return parseJson(this.meta)
    }
}

export default File