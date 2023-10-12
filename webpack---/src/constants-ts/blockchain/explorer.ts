import { Blockchain } from './common'

export const EXPLORERS_BY_CHAIN_ID = JSON.parse(process.env.VUE_APP_EXPLORERS_BY_CHAIN_ID || '')

export const EXPLORER_URL_BY_BLOCKCHAIN = {
  [Blockchain.Ethereum]: process.env.VUE_APP_ETHERSCAN,
  [Blockchain.Binance]: process.env.VUE_APP_EXPLORER_BINANCE,
  [Blockchain.Polygon]: process.env.VUE_APP_EXPLORER_POLYGON,
  [Blockchain.Fantom]: process.env.VUE_APP_EXPLORER_FANTOM,
  [Blockchain.Arbitrum]: process.env.VUE_APP_EXPLORER_ARBITRUM,
  [Blockchain.Tron]: process.env.VUE_APP_EXPLORER_TRON,
}
