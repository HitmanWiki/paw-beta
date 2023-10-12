import Joi from 'joi'
import unescape from 'lodash/unescape'
import Image from '@/models/Image'
import {
    TIME_FIXED,
    TIME_HOURLY
} from '@/constants/backend/service'
import {
    parseSlug
} from '@/utils/parser'
import {
    stripDescriptionTags
} from '@/utils/contract'
import AbstractModel from '../AbstractModel'
import ServiceFreelancersListItem from './ServiceFreelancersListItem'

class ServiceListItem extends AbstractModel {
    static propTypes = {
        id: Joi.number().required(),
        slug: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string(),
        rate: Joi.string().default('0.00'),
        banner: Joi.object().instance(Image),
        images: Joi.array().items(Joi.object().instance(Image)),
        time_type: Joi.allow(TIME_FIXED, TIME_HOURLY).default(TIME_FIXED),
        time_value: Joi.string().default('0'),
        user: Joi.object().instance(ServiceFreelancersListItem),
        skills: Joi.array().default([]),
    }

    static fromServer(data) {
        return data ? new ServiceListItem({
            ...data,
            slug: parseSlug(data.slug),
            name: unescape(data.name),
            description: stripDescriptionTags(data.description),
            rate: String(data.rate || '0.00'),
            time_type: +data.time_type,
            time_value: String(data.time_value || 0),
            banner: Image.fromServer(data.banners, {
                maxSize: 700
            }),
            images: Image.arrayFromServer(data.images, {
                maxSize: 700
            }),
            user: ServiceFreelancersListItem.fromServer(data.user),
        }) : null
    }
}

export default ServiceListItem