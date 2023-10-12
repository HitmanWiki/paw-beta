import Joi from 'joi'
import AbstractModel from '@/models/AbstractModel'
import CommonProfile from '@/models/user/CommonProfile'
import {
    parseSlug
} from '@/utils/parser'
import {
    getDateFromString
} from '@/utils/date'

class ApplicationListItem extends AbstractModel {
    static propTypes = {
        status: Joi.number().required(),
        id: Joi.number().required(),
        job_application_id: Joi.number().allow(null),
        offerId: Joi.number().allow(null),
        textReview: Joi.string().allow('', null),
        slug: Joi.string().allow(null),
        estimate: Joi.number().allow(null),
        created_at: Joi.string().allow(null),
        createdAt: Joi.date(),
        amount: Joi.string().allow(null),
        name: Joi.string().allow(null),
        currency: Joi.string().allow(null),
        customer: Joi.object().instance(CommonProfile).required(),
        freelancer: Joi.object().instance(CommonProfile).required(),
        offer: Joi.object().allow(null),
        job: Joi.object().allow(null),
        stage: Joi.number().allow(null),
        offerStage: Joi.number().allow(null),
        sortField: Joi.string().allow(null),
        isArchived: Joi.boolean().default(false),
    }

    static fromServer(data) {
        const offer = data.relations.Offers ? .length ? data.relations.Offers[0] : null
        return new ApplicationListItem({
            ...data,
            customer: CommonProfile.fromServer(data.relations.Customer),
            freelancer: CommonProfile.fromServer(data.relations.Freelancer),
            status: data.status,
            job_application_id: data.id,
            id: data.job_id,
            estimate: data.deadline ? data.deadline / 86400 : 0, // from seconds to day
            created_at: data.created_at,
            createdAt: getDateFromString(data.created_at),
            textReview: data.comment,
            amount: data.budget ? .amount,
            currency: data.budget ? .currency,
            offer,
            job: data.relations.Job,
            offerId: offer ? .id,
            name: data.relations.Job.name,
            stage: data.relations.Job.stage,
            offerStage: offer ? .stage,
            slug: parseSlug(data.relations.Job.slug),
            sortField: data.created_at,
        })
    }
}

export default ApplicationListItem