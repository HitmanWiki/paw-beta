import BigNumber from 'bignumber.js'
import Joi from 'joi'
import get from 'lodash/get'
import unescape from 'lodash/unescape'
import {
    OFFER_STATUS_NEW,
    OFFER_STATUS_DECLINED_FREELANCER,
    OFFER_STATUS_DECLINED_CUSTOMER,
    OFFER_STATUS_CONFIRMED_FREELANCER,
    OFFER_STATUS_CONFIRMED_CUSTOMER,
    JOB_STATUS_IN_PROGRESS,
    JOB_STATUS_PAYED,
    JOB_STATUS_RETURNED,
    JOB_STATUS_BLOCKED,
    JOB_STATUS_DISPUTED,
    STATUS_PUBLISHED,
    STATUS_DRAFT,
    TIME_FIXED,
    TIME_HOURLY,
} from '@/constants/backend/service'
import AbstractModel from '../AbstractModel'
import CommonProfile from '@/models/user/CommonProfile'
import {
    convertToLocal
} from '@/utils/date'
import {
    DATE_TIME_FORMAT_BY_MERIDIEM
} from '@/constants/date'
import {
    BACKEND_CURRENCIES_BY_ID,
    CURRENCIES,
    CURRENCY_FIELD_BACKEND_ID
} from '@/constants-ts/currency'
import {
    getCurrency
} from '@/utils/currency'
import {
    getUrl
} from '@/utils/file'
import {
    parseSlug
} from '@/utils/parser'
import {
    Blockchain
} from '@/constants-ts/blockchain'

class GigOfferListItem extends AbstractModel {
    static propTypes = {
        id: Joi.number(),
        contractVersion: Joi.number().valid(1, 2).default(1),
        slug: Joi.string().required(),
        sc_id: Joi.string(),
        blockchain: Joi.number().valid(
            Blockchain.Ethereum,
            Blockchain.Binance,
            Blockchain.Polygon,
            Blockchain.Fantom,
            Blockchain.Tron,
            Blockchain.Arbitrum,
        ).allow(null),
        gig_id: Joi.number().required(),
        name: Joi.string().default(''),
        description: Joi.string().default('').allow('', null),
        rate: Joi.string().default('0.00'),
        currency: Joi.string().allow(null),
        preferredCurrencies: Joi.array(),
        isDone: Joi.bool(),
        stage: Joi.allow(
            OFFER_STATUS_NEW,
            OFFER_STATUS_DECLINED_FREELANCER,
            OFFER_STATUS_DECLINED_CUSTOMER,
            OFFER_STATUS_CONFIRMED_FREELANCER,
            OFFER_STATUS_CONFIRMED_CUSTOMER
        ),
        gigStatus: Joi.allow(STATUS_DRAFT, STATUS_PUBLISHED),
        isRemoved: Joi.bool(),
        reviews: Joi.array().default([]),
        hours: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        deadline: Joi.number().allow(null),
        time_type: Joi.allow(TIME_FIXED, TIME_HOURLY).default(TIME_FIXED),
        applicationId: Joi.number().allow(null),
        customerId: Joi.number().allow(null),
        freelancerId: Joi.number().allow(null),
        customerProfile: Joi.object().instance(CommonProfile).allow(null),
        freelancerProfile: Joi.object().instance(CommonProfile).allow(null),
        freelancer_wallet: Joi.string().allow('', null),
        customerWallet: Joi.string().allow('', null),
        createdAt: Joi.string().required(),
        document: Joi.string().allow(null),
        freelancerWallets: Joi.array().default([]),
        job: Joi.object().keys({
            id: Joi.number(),
            escrow_balance: Joi.object().instance(BigNumber),
            freelancer_stake: Joi.object().instance(BigNumber).allow(null),
            customer_stake: Joi.object().instance(BigNumber).allow(null),
            txid_completed: Joi.string().allow(null),
            txid_created: Joi.string().allow(null),
            stage: Joi.allow(
                JOB_STATUS_IN_PROGRESS,
                JOB_STATUS_PAYED,
                JOB_STATUS_RETURNED,
                JOB_STATUS_BLOCKED,
                JOB_STATUS_DISPUTED,
            ),
            created_at: Joi.string().required(),
        }).allow(null),
    }

    static fromServer(data) {
        const currencyBackendId = data.currency || data.relations ? .GigJob ? .currency
        const gig = data.relations.Gig
        let reviews = []
        if (data.relations.GigJob ? .relations ? .Review) {
            reviews = Array.isArray(data.relations.GigJob ? .relations ? .Review) ?
                data.relations.GigJob ? .relations ? .Review :
                [data.relations.GigJob ? .relations ? .Review]
        } else if (data.relations ? .Review) {
            reviews = Array.isArray(data.relations ? .Review) ?
                data.relations ? .Review :
                [data.relations ? .Review]
        }
        return data ? new GigOfferListItem({
            ...data,
            freelancerWallets: data.relations ? .Freelancer ? .wallet || [],
            contractVersion: data.relations ? .GigJob ? .contract_version || 1,
            slug: parseSlug(gig.slug),
            name: unescape(gig.name),
            blockchain: data ? .blockchain || data.relations ? .GigJob ? .blockchain,
            rate: String(data.rate || gig.rate || '0.00'),
            hours: String(data.time_value || gig.time_value) || null,
            time_type: +data.time_type || +gig.time_type || null,
            deadline: +data.deadline || +gig.deadline || null,
            gigStatus: +gig.status,
            isRemoved: Boolean(gig.is_removed),
            reviews: reviews.filter(Boolean),
            createdAt: convertToLocal(data.created_at, DATE_TIME_FORMAT_BY_MERIDIEM),
            currency: currencyBackendId ? BACKEND_CURRENCIES_BY_ID[currencyBackendId] : null,
            preferredCurrencies: gig.relations.Currency || [],
            applicationId: data.gig_application_id,
            freelancerId: data.freelancer_id,
            customerId: data.customer_id,
            customerProfile: data.relations.Customer ? CommonProfile.fromServer(data.relations.Customer) : null,
            freelancerProfile: data.relations.Freelancer ? CommonProfile.fromServer(data.relations.Freelancer) : null,
            customerWallet: get(data, 'relations.GigJob.customer_wallet', null),
            document: data.relations ? .File ? .id ? getUrl(data.relations.File) : null,
            isDone: Boolean(get(data, 'relations.GigJob.is_done', false)),
            job: (data.relations.GigJob && !Array.isArray(data.relations.GigJob)) ? GigOfferListItem.prepareGigJob(data) : null,
        }) : null
    }

    // Blame Just Max for my mental disorder
    static fromServerById(data) {
        const {
            relations,
            ...GigJob
        } = data
        const offer = relations.Offer
        const gigData = {
            ...offer,
            slug: data.slug,
            name: data.name,
            relations: {
                Gig: {
                    ...data.relations.Gig,
                    relations: {
                        Currency: data.relations.Currency
                    },
                },
                GigJob,
                Customer: data.relations.Customer,
                Freelancer: data.relations.Freelancer,
            }
        }
        return GigOfferListItem.fromServer(gigData)
    }

    static prepareGigJob(data) {
        const gigJob = data.relations ? .GigJob
        const currency = getCurrency({
            blockchain: data.blockchain || gigJob ? .blockchain || undefined,
            value: data.currency || gigJob ? .currency,
            field: CURRENCY_FIELD_BACKEND_ID
        })
        return {
            ...gigJob,
            escrow_balance: new BigNumber(gigJob.escrow_balance).dividedBy(currency.baseUnits),
            freelancer_stake: gigJob.freelancer_stake ?
                new BigNumber(gigJob.freelancer_stake).dividedBy(currency.baseUnits) :
                null,
            customer_stake: gigJob.customer_stake ?
                new BigNumber(gigJob.customer_stake).dividedBy(currency.baseUnits) :
                null,
        }
    }
}

export default GigOfferListItem