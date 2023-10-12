import Joi from 'joi'
import ActiveProfile from './ActiveProfile'

class WorkerProfile extends ActiveProfile {
    static propTypes = {
        profession: Joi.string().allow('', null),
        rate: Joi.string().allow('', null),
        registered: Joi.number().allow('', null),
        country_id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        city: Joi.string().allow('', null),
        dob: Joi.string().allow('', null),
        bio: Joi.string().allow('', null),
        avgReview: Joi.number().allow(null),
        userReviews: Joi.number().allow(null),
    }

    static fromServer(data) {
        return new WorkerProfile({
            ...data,
            profession: data ? .profession || '',
            rate: data ? .rate ? String(data.rate) : '0.00',
            dob: data ? .dob || '',
            bio: data ? .bio || '',
            avgReview: data.avg_reviews || 0,
            userReviews: data.reviews_count || 0,
        })
    }
}

export default WorkerProfile