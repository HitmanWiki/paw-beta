import Joi from 'joi'
import {
    METHOD_UNKNOWN
} from '@/constants/blockchain/contract'
import {
    STATUS_APPLIED,
    STATUS_CONFIRMED,
    STATUS_ERROR,
    STATUS_PENDING,
    STATUS_DECLINED,
} from '@/constants/backend/transaction'
import AbstractModel from '@/models/AbstractModel'
import Currency from '@/models-ts/Currency'
import {
    BACKEND_CURRENCY_ETH_ID
} from '@/constants-ts/currency'

class TransactionBackend extends AbstractModel {
    static propTypes = {
        contract_id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        version_id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        task_id: Joi.string().allow(null),
        tx_id: Joi.string().allow(null),
        event: Joi.string().allow(null),
        method: Joi.string().default(METHOD_UNKNOWN),
        status: Joi.number().valid(STATUS_PENDING, STATUS_CONFIRMED, STATUS_ERROR, STATUS_APPLIED, STATUS_DECLINED),
        created_at: Joi.string(),
        gig_job_id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        gig_offer_id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
        params: Joi.object().keys({
            rates: Joi.object().keys({
                calculated_amount: Joi.string().default('0'),
                calculated_currency: Joi.alternatives().try(Joi.number(), Joi.object().instance(Currency)).default(BACKEND_CURRENCY_ETH_ID),
                entity_id: Joi.alternatives().try(Joi.number(), Joi.string()).allow(null),
                payout_amount: Joi.string().default('0'),
                payout_currency: Joi.alternatives().try(Joi.number(), Joi.object().instance(Currency)).default(BACKEND_CURRENCY_ETH_ID),
            }).default(null),
        }).default(null),
    }

    static fromServer(data) {
        return data ?
            new TransactionBackend({
                ...data,
                method: data.method || METHOD_UNKNOWN,
                params: {
                    ...data.params || {},
                    rates: {
                        // eslint-disable-next-line
                        calculated_amount: data.params ? .rates ? .calculated_amount || '0',
                        // eslint-disable-next-line
                        calculated_currency: data.params ? .rates ? .calculated_currency
                            // eslint-disable-next-line
                            ?
                            typeof data.params ? .rates ? .calculated_currency === 'object'
                            // eslint-disable-next-line
                            ?
                            data.params ? .rates ? .calculated_currency.backendId
                            // eslint-disable-next-line
                            :
                            data.params ? .rates ? .calculated_currency :
                            BACKEND_CURRENCY_ETH_ID,
                        // eslint-disable-next-line
                        entity_id: data.params ? .rates ? .entity_id || null,
                        // eslint-disable-next-line
                        payout_amount: data.params ? .rates ? .payout_amount || '0',
                        // eslint-disable-next-line
                        payout_currency: data.params ? .rates ? .payout_currency
                            // eslint-disable-next-line
                            ?
                            typeof data.params ? .rates ? .payout_currency === 'object'
                            // eslint-disable-next-line
                            ?
                            data.params ? .rates ? .payout_currency.backendId
                            // eslint-disable-next-line
                            :
                            data.params ? .rates ? .payout_currency :
                            BACKEND_CURRENCY_ETH_ID,
                    },
                },
            }) :
            null
    }
}

export default TransactionBackend