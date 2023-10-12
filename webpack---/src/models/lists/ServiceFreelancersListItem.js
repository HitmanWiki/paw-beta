import Joi from 'joi'
import unescape from 'lodash/unescape'
import AbstractModel from '@/models/AbstractModel'
import {
    Avatar
} from '@/models/user'
import {
    ACCOUNT_TYPES,
    USER_ACCOUNT_SIMPLE
} from '@/constants/accountTypes'

class ServiceFreelancersListItem extends AbstractModel {
    static propTypes = {
        id: Joi.number().required(),
        name: Joi.string().required(),
        avatar: Joi.object().instance(Avatar).allow(null),
        avg_reviews: Joi.number().default(0),
        avg_reputation: Joi.number().default(0),
        type: Joi.number().valid(...ACCOUNT_TYPES).default(USER_ACCOUNT_SIMPLE),
        created_at: Joi.string().default(''),
        meta: Joi.any(),
        reviews_count: Joi.number().default(0),
    }

    static fromServer(data) {
        return new ServiceFreelancersListItem({
            ...data,
            name: unescape(data.name),
            avatar: data.avatar ? Avatar.fromServer(data.avatar) : null,
            avg_reviews: data.rating.avg_reviews,
            avg_reputation: data.rating.avg_reputation,
            created_at: data.profile ? .created_at,
        })
    }
}

export default ServiceFreelancersListItem