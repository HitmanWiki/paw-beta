import Joi from 'joi'
import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
import unescape from 'lodash/unescape'
import AbstractModel from '@/models/AbstractModel'
import File from '@/models/File'
import Image from '@/models/Image'
import ServiceFreelancersListItem from '@/models/lists/ServiceFreelancersListItem'
import {
    CAT_IMG_CROPPED
} from '@/constants/file'
import {
    TIME_FIXED,
    TIME_HOURLY
} from '@/constants/backend/service'
import {
    parseSlug
} from '@/utils/parser'

class Gig extends AbstractModel {
    static propTypes = {
        id: Joi.number(),
        slug: Joi.string().allow('').default(''),
        user_id: Joi.number(),
        user_name: Joi.string().allow('', null).default(''),
        name: Joi.string().default(''),
        description: Joi.string().default(''),
        rate: Joi.string().default('0.00'),
        relations: Joi.object().keys({
            Banner: Joi.array().items(Joi.object().instance(File)).default([]),
            Currency: Joi.array().items(Joi.object().keys({
                blockchain: Joi.number(),
                currency: Joi.number(),
            })).default([]),
            Freelancer: Joi.object().instance(ServiceFreelancersListItem),
            File: Joi.array().items(Joi.object().instance(File)).default([]),
            Image: Joi.array().items(Joi.object().instance(File)).default([]),
            Skill: Joi.array().default([]),
        }).default(undefined),
        status: Joi.number(),
        time_type: Joi.allow(TIME_FIXED, TIME_HOURLY).default(TIME_FIXED),
        time_value: Joi.string().default('0'),
        more: Joi.object(),
        meta: Joi.object(),
        offerStage: Joi.number().allow('', null),
        createdAt: Joi.string().allow('', null).default(null),
        publishedAt: Joi.string().allow('', null).default(null),
        views: Joi.number().allow(null).default(0),
    }

    static fromServer(data) {
        const offers = data.relations.Offer || []
        return data ? new Gig({
            ...data,
            createdAt: data.created_at,
            publishedAt: data.first_published_at,
            slug: parseSlug(data.slug),
            name: unescape(data.name),
            time_value: String(data.time_value || 0),
            rate: data.rate ? String(Number(data.rate).toFixed(2)) : '0.00',
            offerStage: offers.length ? offers[offers.length - 1].stage : null,
            relations: {
                ...data.relations,
                Currency: sortBy(data.relations ? .Currency, 'blockchain'),
                Banner: (data.relations ? .Banner || []).map(File.fromServer),
                Freelancer: ServiceFreelancersListItem.fromServer(data.relations ? .Freelancer),
                File: (data.relations ? .File || []).map(File.fromServer),
                Image: (data.relations ? .Image || []).map(File.fromServer),
            }
        }) : null
    }

    static toServer(data) {
        return omit(data, ['id', 'status', 'relations.Freelancer'])
    }

    get banner() {
        return Image.fromServer(this.relations.Banner, {
            category: CAT_IMG_CROPPED
        })
    }

    get images() {
        const images = Image.arrayFromServer(this.relations.Image.filter(file => !file.base64), {
            category: CAT_IMG_CROPPED
        })
        const uploaded = this.relations.Image.filter(file => file.base64)
        return images.concat(uploaded)
    }
}

export default Gig