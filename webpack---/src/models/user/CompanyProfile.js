import Joi from 'joi'
import unescape from 'lodash/unescape'
import {
    USER_TYPE_CUSTOMER_COMPANY
} from '@/constants/user'
import ActiveProfile from './ActiveProfile'

class CompanyProfile extends ActiveProfile {
    static propTypes = {
        company_name: Joi.string().allow('', null),
        company_size: Joi.number().allow('', null),
        registered: Joi.number().allow('', null),
        description: Joi.string().allow('', null),
        website: Joi.string().allow('', null),
        address: Joi.string().allow('', null),
        relations: Joi.object().keys({
            Country: Joi.array(),
            Skill: Joi.array(),
            Currency: Joi.array(),
        })
    }

    static fromServer(data) {
        return new CompanyProfile({
            ...data,
            address: data.address || '',
            company_size: data.company_size || '',
            company_name: unescape(data.company_name || ''),
            description: data.description || '',
            website: data.website || '',
        })
    }

    get name() {
        return unescape(this.company_name)
    }

    get type() {
        return USER_TYPE_CUSTOMER_COMPANY
    }
}

export default CompanyProfile