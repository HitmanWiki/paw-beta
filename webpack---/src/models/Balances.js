import Joi from 'joi'
import {
    Blockchain
} from '@/constants-ts/blockchain'
import AbstractModel from './AbstractModel'
import {
    CURRENCIES_BLOCKCHAIN_BINANCE,
    CURRENCIES_BLOCKCHAIN_ETHEREUM,
    CURRENCIES_BLOCKCHAIN_POLYGON,
    CURRENCIES_BLOCKCHAIN_FANTOM,
    CURRENCIES_BLOCKCHAIN_TRON,
    CURRENCIES_BLOCKCHAIN_ARBITRUM,
} from '@/constants-ts/currency'

const getCurrencyMap = (currencies) => (currencies || []).reduce((acc, cur) => {
    acc[cur.name] = '0'
    return acc
}, {})

class Balances extends AbstractModel {
    static propTypes = {
        [Blockchain.Ethereum]: Joi.object().default(getCurrencyMap(CURRENCIES_BLOCKCHAIN_ETHEREUM)),
        [Blockchain.Binance]: Joi.object().default(getCurrencyMap(CURRENCIES_BLOCKCHAIN_BINANCE)),
        [Blockchain.Polygon]: Joi.object().default(getCurrencyMap(CURRENCIES_BLOCKCHAIN_POLYGON)),
        [Blockchain.Tron]: Joi.object().default(getCurrencyMap(CURRENCIES_BLOCKCHAIN_TRON)),
        [Blockchain.Fantom]: Joi.object().default(getCurrencyMap(CURRENCIES_BLOCKCHAIN_FANTOM)),
        [Blockchain.Arbitrum]: Joi.object().default(getCurrencyMap(CURRENCIES_BLOCKCHAIN_ARBITRUM)),
    }
}

export default Balances