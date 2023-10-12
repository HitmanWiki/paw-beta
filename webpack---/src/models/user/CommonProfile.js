import Joi from 'joi'
import unescape from 'lodash/unescape'
import AbstractModel from '@/models/AbstractModel'
import {
    ACCOUNT_TYPES,
    USER_ACCOUNT_SIMPLE
} from '@/constants/accountTypes'
import {
    USER_TYPE_CUSTOMER_PERSON
} from '@/constants/user'
import ActiveProfile from './ActiveProfile'
import Avatar from './Avatar'
import CompanyProfile from './CompanyProfile'
import EmployerProfile from './EmployerProfile'
import WorkerProfile from './WorkerProfile'

class CommonProfile extends AbstractModel {
    static propTypes = {
        id: Joi.number(),
        profile: Joi.alternatives().try(
            Joi.object().instance(ActiveProfile),
            Joi.object().instance(WorkerProfile),
            Joi.object().instance(EmployerProfile),
            Joi.object().instance(CompanyProfile),
        ),
        avatar: Joi.object().instance(Avatar).allow(null),
        name: Joi.string().allow('', null),
        type: Joi.number().valid(...ACCOUNT_TYPES).default(USER_ACCOUNT_SIMPLE),
        avgReviews: Joi.any(),
        reviewsCount: Joi.any(),
    }

    static fromServer({
        id,
        profile: profile_,
        avatar,
        type,
        name,
        reviews_count
    }) {
        let profile = null
        const hasType = !!profile_ ? .type
        if (!hasType) {
            profile = WorkerProfile.fromServer(profile_)
        } else if (profile_.type === USER_TYPE_CUSTOMER_PERSON) {
            profile = EmployerProfile.fromServer(profile_)
        } else {
            profile = CompanyProfile.fromServer(profile_)
        }
        return new CommonProfile({
            id,
            type,
            profile,
            avatar: avatar ? Avatar.fromServer(avatar) : null,
            name: unescape(name),
            avgReviews: Number(profile_.avg_reviews || 0).toFixed(2),
            reviewsCount: reviews_count || 0
        })
    }
}

export default CommonProfile