import Joi from 'joi'
import unescape from 'lodash/unescape'
import {
    getName
} from '@/utils/profile'
import AbstractModel from '../AbstractModel'

class ActiveProfile extends AbstractModel {
    static propTypes = {
        id: Joi.number().allow(null),
        first_name: Joi.string().allow('', null),
        last_name: Joi.string().allow('', null),
    }

    constructor(data) {
        const id = data.id || data.user_id
        super({ ...data,
            id,
            first_name: unescape(data.first_name || ''),
            last_name: unescape(data.last_name || ''),
        })
    }

    static fromServer(data) {
        return new ActiveProfile(data)
    }

    get name() {
        return getName(this)
    }
}

export default ActiveProfile