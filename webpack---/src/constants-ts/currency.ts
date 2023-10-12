import Currency from '@/models-ts/Currency'
import { Blockchain } from '@/constants-ts/blockchain'
import { getCurrency } from '@/utils-ts/currencies'

export const BASE_UNITS_IN_ETH = Math.pow(10, 18)
export const GWEI_IN_ETH = Math.pow(10, 9)

export const BACKEND_CURRENCY_ETH_ID = 2
export const BACKEND_CURRENCY_USDT_ID = 3

export const CURRENCIES_BLOCKCHAIN_ETHEREUM = JSON.parse(process.env.VUE_APP_CURRENCIES_BLOCKCHAIN_ETHEREUM || '{}')
export const CURRENCIES_BLOCKCHAIN_BINANCE = JSON.parse(process.env.VUE_APP_CURRENCIES_BLOCKCHAIN_BINANCE || '{}')
export const CURRENCIES_BLOCKCHAIN_POLYGON = JSON.parse(process.env.VUE_APP_CURRENCIES_BLOCKCHAIN_POLYGON || '{}')
export const CURRENCIES_BLOCKCHAIN_FANTOM = JSON.parse(process.env.VUE_APP_CURRENCIES_BLOCKCHAIN_FANTOM || '{}')
export const CURRENCIES_BLOCKCHAIN_ARBITRUM = JSON.parse(process.env.VUE_APP_CURRENCIES_BLOCKCHAIN_ARBITRUM || '{}')
export const CURRENCIES_BLOCKCHAIN_TRON = JSON.parse(process.env.VUE_APP_CURRENCIES_BLOCKCHAIN_TRON || '{}')

export const CURRENCIES = [
  ...Currency.toArrayCurrencies({
    arr: CURRENCIES_BLOCKCHAIN_ETHEREUM,
    network: process.env.VUE_APP_NETWORK_ETHEREUM,
    blockchain: Blockchain.Ethereum,
  }),
  ...Currency.toArrayCurrencies({
    arr: CURRENCIES_BLOCKCHAIN_BINANCE,
    network: process.env.VUE_APP_NETWORK_BINANCE,
    blockchain: Blockchain.Binance,
  }),
  ...Currency.toArrayCurrencies({
    arr: CURRENCIES_BLOCKCHAIN_POLYGON,
    network: process.env.VUE_APP_NETWORK_POLYGON,
    blockchain: Blockchain.Polygon,
  }),
  ...Currency.toArrayCurrencies({
    arr: CURRENCIES_BLOCKCHAIN_FANTOM,
    network: process.env.VUE_APP_NETWORK_FANTOM,
    blockchain: Blockchain.Fantom,
  }),
  ...Currency.toArrayCurrencies({
    arr: CURRENCIES_BLOCKCHAIN_ARBITRUM,
    network: process.env.VUE_APP_NETWORK_ARBITRUM,
    blockchain: Blockchain.Arbitrum,
  }),
  ...Currency.toArrayCurrencies({
    arr: CURRENCIES_BLOCKCHAIN_TRON,
    network: '_',
    blockchain: Blockchain.Tron,
  }),
]

export const ETHEREUM_WNATIVE = process.env.VUE_APP_WNATIVE_ETHEREUM
export const BINANCE_WNATIVE = process.env.VUE_APP_WNATIVE_BINANCE
export const POLYGON_WNATIVE = process.env.VUE_APP_WNATIVE_POLYGON
export const FANTOM_WNATIVE = process.env.VUE_APP_WNATIVE_FANTOM
export const ARBITRUM_WNATIVE = process.env.VUE_APP_WNATIVE_ARBITRUM
export const TRON_WNATIVE = process.env.VUE_APP_WNATIVE_TRON

export const WNATIVE_BY_BLOCKCHAIN = {
  [Blockchain.Ethereum]: ETHEREUM_WNATIVE,
  [Blockchain.Binance]: BINANCE_WNATIVE,
  [Blockchain.Polygon]: POLYGON_WNATIVE,
  [Blockchain.Fantom]: FANTOM_WNATIVE,
  [Blockchain.Arbitrum]: ARBITRUM_WNATIVE,
  [Blockchain.Tron]: TRON_WNATIVE,
}

export const BACKEND_CURRENCIES_BY_ID = CURRENCIES.reduce((accum, item) => ({
  ...accum,
  [item.backendId]: item.name
}), {})

export const CURRENCY_FIELD_NAME = 1
export const CURRENCY_FIELD_BACKEND_ID = 2
export const CURRENCY_FIELD_BACKEND_NAME = 3

const mapCurrency = (blockchain: Blockchain) => (value: string) => getCurrency({ blockchain, value })
export const STABLECOINS = [
  ...['DAI', 'USDT', 'USDC', 'AUDT'].map(mapCurrency(Blockchain.Ethereum)),
  ...['DAI', 'BUSD', 'USDT', 'USDC'].map(mapCurrency(Blockchain.Binance)),
  ...['DAI'].map(mapCurrency(Blockchain.Polygon)),
  ...['DAI', 'fUSDT', 'USDC'].map(mapCurrency(Blockchain.Fantom)),
  ...['DAI', 'USDT', 'USDC'].map(mapCurrency(Blockchain.Arbitrum)),
  ...['USDT'].map(mapCurrency(Blockchain.Tron)),
].filter(Boolean)
