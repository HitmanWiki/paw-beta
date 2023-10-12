import { Blockchain } from './common'

const BLOCKCHAIN_NETWORK_ETHEREUM = process.env.VUE_APP_NETWORK_ETHEREUM || '1'
const BLOCKCHAIN_NETWORK_BINANCE = process.env.VUE_APP_NETWORK_BINANCE || '56'
const BLOCKCHAIN_NETWORK_POLYGON = process.env.VUE_APP_NETWORK_POLYGON || '137'
const BLOCKCHAIN_NETWORK_FANTOM = process.env.VUE_APP_NETWORK_FANTOM || '250'
const BLOCKCHAIN_NETWORK_ARBITRUM = process.env.VUE_APP_NETWORK_ARBITRUM || '42161'

export const ChainId = {
  [Blockchain.Ethereum]: BLOCKCHAIN_NETWORK_ETHEREUM,
  [Blockchain.Binance]: BLOCKCHAIN_NETWORK_BINANCE,
  [Blockchain.Polygon]: BLOCKCHAIN_NETWORK_POLYGON,
  [Blockchain.Fantom]: BLOCKCHAIN_NETWORK_FANTOM,
  [Blockchain.Arbitrum]: BLOCKCHAIN_NETWORK_ARBITRUM,
  [Blockchain.Tron]: undefined,
}

export function getChainIdByBlockchain (blockchain: Blockchain): number {
  switch (blockchain) {
    case Blockchain.Ethereum:
      return Number(process.env.VUE_APP_NETWORK_ETHEREUM)
    case Blockchain.Binance:
      return Number(process.env.VUE_APP_NETWORK_BINANCE)
    case Blockchain.Polygon:
      return Number(process.env.VUE_APP_NETWORK_POLYGON)
    case Blockchain.Fantom:
      return Number(process.env.VUE_APP_NETWORK_FANTOM)
    case Blockchain.Arbitrum:
      return Number(process.env.VUE_APP_NETWORK_ARBITRUM)
    default:
      return Number(process.env.VUE_APP_NETWORK_ETHEREUM)
  }
}

export const BlockchainByChainId = {
  [process.env.VUE_APP_NETWORK_ETHEREUM || '1']: Blockchain.Ethereum,
  [process.env.VUE_APP_NETWORK_BINANCE || '56']: Blockchain.Binance,
  [process.env.VUE_APP_NETWORK_POLYGON || '137']: Blockchain.Polygon,
  [process.env.VUE_APP_NETWORK_FANTOM || '250']: Blockchain.Fantom,
  [process.env.VUE_APP_NETWORK_ARBITRUM || '42161']: Blockchain.Arbitrum,
}
