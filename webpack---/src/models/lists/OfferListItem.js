import BigNumber from 'bignumber.js'
import Joi from 'joi'
import unescape from 'lodash/unescape'
import Avatar from '@/models/user/Avatar'
import AbstractModel from '@/models/AbstractModel'
import CommonProfile from '@/models/user/CommonProfile'
import * as offerStatuses from '@/constants/offerStatuses'
import {
    BACKEND_CURRENCY_USDT_ID,
    BACKEND_CURRENCIES_BY_ID
} from '@/constants-ts/currency'
import {
    STAGE_BLOCKED_BY_FREELANCER,
    STAGE_COMPLETED,
    STAGE_DEADLINE_OVERDUE,
    STAGE_DISPUTED,
    STAGE_IN_PROGRESS,
    STAGE_NEW,
    STAGE_STARTED,
} from '@/constants/jobStages'
import {
    stripDescriptionTags
} from '@/utils/contract'
import {
    formatCurrency
} from '@/utils/moneyFormat'
import {
    getCurrency
} from '@/utils/currency'
import {
    parseSlug
} from '@/utils/parser'
import {
    Blockchain
} from '@/constants-ts/blockchain'

class OfferListItem extends AbstractModel {
    static propTypes = {
        id: Joi.number().required(),
        slug: Joi.string().required(),
        offerId: Joi.number().required(),
        offerStage: Joi.number().valid(...Object.values(offerStatuses)).required(),
        stage: Joi.number().valid(
            STAGE_NEW,
            STAGE_STARTED,
            STAGE_IN_PROGRESS,
            STAGE_COMPLETED,
            STAGE_DEADLINE_OVERDUE,
            STAGE_BLOCKED_BY_FREELANCER,
            STAGE_DISPUTED
        ).default(STAGE_NEW),
        name: Joi.string().allow(null).required(),
        currency: Joi.string().allow('', null).default(BACKEND_CURRENCY_USDT_ID),
        budget: Joi.string().required(),
        escrow_balance: Joi.string().allow('', null),
        blockchain: Joi.number().default(Blockchain.Ethereum),
        description: Joi.string().required(),
        user: Joi.object().instance(CommonProfile).required(),
        txid_created: Joi.string().allow(null),
        txid_completed: Joi.string().allow(null),
        delivery_time_at: Joi.string().allow(null),
        textReview: Joi.string().allow('', null),
        job_application_id: Joi.number().allow(null),
        customer_id: Joi.number().allow(null),
        freelancer_id: Joi.number().allow(null),
        is_done: Joi.number().allow(null),
        contract_version: Joi.number().allow(null),
        sc_id: Joi.string().allow(null),
        inProgressAt: Joi.string().allow(null),
        freelancer: Joi.object().allow(null),
        estimate: Joi.number().allow(null),
        customer_wallet: Joi.string().allow(null),
        currencyNumber: Joi.number().allow(null),
        customer_approved_at: Joi.string().allow(null),
        sortField: Joi.string().allow(null),
    }

    static fromServer(data) {
        const freelancerData = data.relations.Freelancer
        const freelancer = (!freelancerData || Array.isArray(freelancerData)) ? null : {
            id: freelancerData ? .id,
            name: unescape(freelancerData ? .name),
            avatar: Avatar.fromServer(freelancerData.avatar),
            type: freelancerData.type,
            avgReviews: freelancerData.rating.avg_reviews,
            reviewsCount: freelancerData.reviews_count,
        }
        return new OfferListItem({
            ...data,
            id: data.job_id,
            slug: parseSlug(data.relations.Job.slug),
            stage: data.relations.Job.stage,
            offerId: data.id,
            offerStage: data.stage,
            name: unescape(data.relations.Job.name),
            budget: data.relations.Job.budget,
            escrow_balance: data.relations.Job.escrow_balance,
            blockchain: data.relations.Job.blockchain,
            currency: BACKEND_CURRENCIES_BY_ID[data.relations.Job.currency || BACKEND_CURRENCY_USDT_ID],
            currencyNumber: data.relations.Job.currency || BACKEND_CURRENCY_USDT_ID,
            user: CommonProfile.fromServer(data.relations.Customer || data.relations.Freelancer),
            description: stripDescriptionTags(data.relations.Job.description),
            txid_created: data.relations.Job.txid_created,
            txid_completed: data.relations.Job.txid_completed,
            delivery_time_at: data.relations.Job.delivery_time_at,
            textReview: data.relations.Review ? .text,
            is_done: data.relations.Job.is_done,
            contract_version: data.relations.Job.contract_version,
            sc_id: data.relations.Job.sc_id,
            customer_wallet: data.relations.Job.customer_wallet,
            inProgressAt: data.relations.Job.in_progress_at,
            freelancer,
            estimate: data.relations.Job.deadline ? data.relations.Job.deadline / 86400 : 0, // from seconds to day
            sortField: data.created_at,
        })
    }

    get isDeclined() {
        return this.offerStatus === offerStatuses.OFFER_DECLINED
    }

    get escrowBalance() {
        if (this.escrow_balance) {
            const currency = getCurrency({
                value: this.currency,
                blockchain: this.blockchain
            })
            return new BigNumber(this.escrow_balance).dividedBy(currency.baseUnits)
        }
    }

    getBudgetFormat() {
        if (this.escrow_balance) {
            const currency = getCurrency({
                value: this.currency,
                blockchain: this.blockchain
            })
            const escrowBalance = new BigNumber(this.escrow_balance).dividedBy(currency.baseUnits)
            return formatCurrency(escrowBalance, {
                currency
            })
        }
        return formatCurrency(this.budget, {
            currency: this.currency
        })
    }
}

export default OfferListItem