import AbstractModel from './AbstractModel'
import Joi from 'joi'
import {
    METHOD_MODE_SIGN,
    METHOD_MODE_ESTIMATE,
    METHOD_MODE_SIGN_AND_SEND,
} from '@/constants/contractMethodModes'

class TransactionData extends AbstractModel {
    static propTypes = {
        mode: Joi.string().valid(
            METHOD_MODE_SIGN,
            METHOD_MODE_ESTIMATE,
            METHOD_MODE_SIGN_AND_SEND,
        ).allow(null),
        eventEmitter: Joi.any().allow(null),
        successEventSignature: Joi.string().allow(null),
        signedData: Joi.object({
            rawTransaction: Joi.string().allow(null),
            transactionHash: Joi.string().allow(null),
        }).default({}),
        estimateData: Joi.object({
            gasPrice: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null),
            gasLimit: Joi.alternatives().try(Joi.string(), Joi.number()).allow(null),
            feeWei: Joi.string().allow(null),
            value: Joi.string().allow(null),
        }).default({}),
    }
}

export default TransactionData