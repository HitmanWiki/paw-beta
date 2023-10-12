import Joi from 'joi'
import Reputations from '@/constants/Reputations'
import AbstractModel from '../AbstractModel'

class Reputation extends AbstractModel {
    static propTypes = {
        counters: Joi.object().default({
            1: [],
            2: []
        }),
        ratings: Joi.object().default({
            1: {
                value: 0,
                categories: []
            },
            2: {
                value: 0,
                categories: []
            }
        }),
    }

    static fromServer(data) {
        return new Reputation(!Array.isArray(data) ? {
            ...data,
            counters: !Array.isArray(data.counters) ? data.counters : {}
        } : {})
    }

    getTotal(forClient) {
        return this.ratings[forClient ? 1 : 2].value
    }

    getProfileReputation(forClient) {
        return this.calcReputations(Reputations.PROFILE, forClient)
    }

    getDocumentsReputation(forClient) {
        return this.calcReputations(Reputations.DOCUMENTS, forClient)
    }

    getContractsReputation(forClient) {
        const gigs = this.calcReputations(Reputations.GIGS, forClient)
        const jobs = this.calcReputations(Reputations.JOBS, forClient)
        return {
            total: gigs.total + jobs.total,
            values: [...gigs.values, ...jobs.values]
        }
    }

    getReviewsReputation(forClient) {
        return this.calcReputations(Reputations.REVIEWS, forClient)
    }

    getGigsReputation(forClient) {
        return this.calcReputations(Reputations.GIGS, forClient)
    }

    getJobsReputation(forClient) {
        return this.calcReputations(Reputations.JOBS, forClient)
    }

    calcReputations(type, forClient) {
        let category = this.ratings[forClient ? 1 : 2] ? .categories
        if (category) {
            category = category.find(({
                id
            }) => id === type)
        }
        if (!category) {
            return {
                total: 0,
                values: []
            }
        }
        const res = {
            total: category.value
        }
        res.values = !category.types ? [] : category.types.map(type => {
            const reputation = Reputations.getReputation(type.id)
            if (reputation) {
                return { ...reputation,
                    value: type.value
                }
            }
        }).filter(Boolean)
        return res
    }
}

export default Reputation