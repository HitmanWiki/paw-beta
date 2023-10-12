import Joi from 'joi'
import AbstractModel from '@/models/AbstractModel'
import * as buttons from '@/constants/button'

class Button extends AbstractModel {
    static propTypes = {
        text: Joi.string().required(),
        theme: Joi.string().allow(...Object.values(buttons)).default(buttons.BUTTON_BLUE_MEDIUM),
        onClick: Joi.func().default(() => {}),
    }
}

export default Button