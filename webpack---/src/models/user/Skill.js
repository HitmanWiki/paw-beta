import Joi from 'joi'
import AbstractModel from '../AbstractModel'

class Skill extends AbstractModel {
    static propTypes = {
        id: Joi.number().required(),
        name: Joi.string().required(),
        url: Joi.string().default('').allow('', null),
        is_custom: Joi.number(),
    }
    static fromServer(data) {
        return new Skill(data)
    }
}

export default Skill