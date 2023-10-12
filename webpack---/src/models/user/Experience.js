import Joi from 'joi'
import AbstractModel from '../AbstractModel'
import {
    formatDate,
    getDateFromString,
    isBefore
} from '@/utils/date'

class Experience extends AbstractModel {
    static propTypes = {
        id: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
        organization: Joi.string().default('').allow('', null),
        position: Joi.string().default('').allow('', null),
        from: Joi.object().default('').allow('', null),
        to: Joi.object().default('').allow('', null),
        duties: Joi.string().default('').allow('', null),
        person_name: Joi.string().default('').allow('', null),
        person_email: Joi.string().default('').allow('', null),
        person_phone: Joi.string().default('').allow('', null),
    }

    constructor(data) {
        const NOW = '1970-01'
        const to = data.to === '0' || isBefore(data.to, NOW) ? NOW : data.to
        super({
            ...data,
            from: getDateFromString(data.from, 'YYYY-MM'),
            to: getDateFromString(to, 'YYYY-MM'),
        })
    }

    static fromServer(data) {
        return new Experience(data)
    }

    static toServer({
        id,
        ...data
    }) {
        return {
            ...data,
            organization: data.organization.trim(),
            position: data.position.trim(),
            from: formatDate(data.from, 'YYYY-MM'),
            to: formatDate(data.to, 'YYYY-MM'),
        }
    }

    isNow() {
        return +getDateFromString(this.to) === 0
    }
}

export default Experience