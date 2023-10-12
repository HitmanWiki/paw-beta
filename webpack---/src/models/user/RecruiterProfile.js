import Joi from 'joi'
import unescape from 'lodash/unescape'
import {
    USER_TYPE_RECRUITER
} from '@/constants/user'
import ActiveProfile from './ActiveProfile'

class RecruiterProfile extends ActiveProfile {
    static propTypes = {
        company_name: Joi.string().allow('', null),
    }

    static fromServer(data) {
        return new RecruiterProfile({
            ...data,
            company_name: unescape(data.company_name || ''),
        })
    }

    get name() {
        return unescape(this.company_name)
    }

    get type() {
        return USER_TYPE_RECRUITER
    }
}

export default RecruiterProfile