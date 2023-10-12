import Joi from 'joi'
import maxBy from 'lodash/maxBy'
import AbstractModel from '@/models/AbstractModel'
import {
    CAT_IMG_ORIGINAL,
    CAT_IMG_RESIZED
} from '@/constants/file'
import {
    parseJson
} from '@/utils/parser'
import {
    getUrl
} from '@/utils/file'

class Image extends AbstractModel {
    static propTypes = {
        id: Joi.alternatives(Joi.string(), Joi.number()).allow('', null),
        src: Joi.string().allow('', null),
        srcSet: Joi.string().allow('', null),
        description: Joi.string().allow('', null),
        name: Joi.string().allow('', null),
        alt: Joi.string().allow('', null),
    }

    static fromServer(data, {
        category = CAT_IMG_RESIZED,
        maxSize = 1600
    } = {}) {
        if (data ? .length) {
            const images = data
                .filter(file => file.category === category)
                .map(file => {
                    const width = parseJson(file.meta).width
                    if (width && width < maxSize) {
                        return {
                            src: getUrl(file),
                            width
                        }
                    }
                })
                .filter(Boolean)
            const maxImage = maxBy(images, 'width')
            const srcSet = images
                .map(file => `${file.src} ${file.width}w`)
                .join(', ')
            const original = data.find(file => !file.category || file.category === CAT_IMG_ORIGINAL)
            return new Image({
                src: maxImage ? .src || getUrl(original),
                srcSet: srcSet,
                description: original.description,
                name: original.name,
                id: original.id,
            })
        }
    }

    static arrayFromServer(images, params) {
        return (images || [])
            .filter(file => !file.category || file.category === CAT_IMG_ORIGINAL)
            .map(orig => [orig, ...images.filter(file => file.filename.includes(orig.filename))])
            .map(img => Image.fromServer(img, params))
    }
}

export default Image