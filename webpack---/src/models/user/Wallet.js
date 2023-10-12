import Joi from 'joi'
import {
    WalletGroup
} from '@/constants-ts/blockchain'
import AbstractModel from '../AbstractModel'

class Wallet extends AbstractModel {
    static propTypes = {
        type: Joi.number(),
        address: Joi.string().required(),
        is_default: Joi.number(),
        group: Joi.number().valid(
            WalletGroup.Cloud,
            WalletGroup.Metamask,
            WalletGroup.WalletConnect,
            WalletGroup.TronLink
        ).allow(null),
        name: Joi.string().allow('', null),
    }
    static fromServer(data) {
        return data ? new Wallet(data) : null
    }
}

export default Wallet