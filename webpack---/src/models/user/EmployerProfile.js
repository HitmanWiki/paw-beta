import Joi from 'joi'
import ActiveProfile from './ActiveProfile'
import {
    USER_TYPE_CUSTOMER_PERSON
} from '@/constants/user'

class EmployerProfile extends ActiveProfile {
    static propTypes = {
        description: Joi.string().allow('', null),
        website: Joi.string().allow('', null),
        relations: Joi.object().keys({
            Country: Joi.array(),
            Skill: Joi.array(),
            Currency: Joi.array(),
        })
    }

    static fromServer(data) {
        return new EmployerProfile({
            ...data,
            description: data.description || '',
            website: data.website || '',
        })
    }

    get type() {
        return USER_TYPE_CUSTOMER_PERSON
    }
}

export default EmployerProfile