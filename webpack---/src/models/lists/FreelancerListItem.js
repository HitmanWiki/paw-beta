import Joi from 'joi'
import unescape from 'lodash/unescape'
import AbstractModel from '@/models/AbstractModel'
import {
    ACCOUNT_TYPES,
    USER_ACCOUNT_SIMPLE
} from '@/constants/accountTypes'
import {
    Avatar,
    Skill
} from '@/models/user'
import {
    getAddress
} from '@/utils/profile'

class FreelancerListItem extends AbstractModel {
    static propTypes = {
        id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        type: Joi.number().valid(...ACCOUNT_TYPES).default(USER_ACCOUNT_SIMPLE),
        avatar: Joi.object().instance(Avatar).allow(null),
        name: Joi.string().allow('', null),
        profession: Joi.string().allow('', null),
        rate: Joi.string().allow('', null),
        registered: Joi.number().allow('', null),
        dob: Joi.string().allow('', null),
        bio: Joi.string().allow('', null),
        city: Joi.string().allow('', null),
        country: Joi.string().allow('', null),
        avg_reputation: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null).default('0'),
        avg_reviews: Joi.alternatives().try(Joi.number(), Joi.string()).allow('', null).default('0'),
        skills: Joi.array().items(Joi.object().instance(Skill)),
        count: Joi.object().keys({
            reviews: Joi.number().allow('', null).default(0),
            completed_contracts: Joi.number().allow('', null).default(0),
        }),
    }

    static fromServer(data) {
        return new FreelancerListItem({
            ...data,
            name: unescape(data.name),
            avatar: data.avatars ? Avatar.fromServer(data.avatars) : null,
            skills: (data.skills || []).map(Skill.fromServer),
        })
    }

    get address() {
        return getAddress(this)
    }
}

export default FreelancerListItem