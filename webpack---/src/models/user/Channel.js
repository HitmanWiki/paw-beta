import Joi from 'joi'
import AbstractModel from '../AbstractModel'
import {
    CHANNEL_LINKEDIN,
    CHANNEL_FACEBOOK,
    CHANNEL_BLOG,
    CHANNEL_TWITTER
} from '@/constants/backend/channels'

class Channel extends AbstractModel {
    static propTypes = {
        type: Joi.number().valid(CHANNEL_LINKEDIN, CHANNEL_TWITTER, CHANNEL_FACEBOOK, CHANNEL_BLOG).default(4),
        value: Joi.string().default(''),
        isVisible: Joi.bool(),
    }
    static fromServer(data) {
        return new Channel({
            ...data,
            isVisible: Boolean(data.is_visible),
        })
    }
    static toServer(data) {
        return {
            type: data.type,
            value: data.value,
            is_visible: Number(data.isVisible),
        }
    }
}

export default Channel