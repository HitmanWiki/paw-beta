import { Blockchain } from '@/constants-ts/blockchain'

export interface SendTransactionEvents {
  'transactionHash': (hash: string) => void;
  'error': (err: Error) => void;
}

type ProvidersByChainIdType = {
  [key: string]: string
}

type ProvidersByBlockchainType = {
  [key: number]: string
}

const keys: string[] = JSON.parse(process.env.VUE_APP_INFURA_KEYS || '[]')
export const infuraKey = keys[Math.floor(Math.random() * keys.length)]

export const ProviderByBlockchain: ProvidersByBlockchainType = {
  [Blockchain.Ethereum]: process.env.VUE_APP_WEB3_PROVIDER_ETHEREUM + (process.env.VUE_APP_MODE === 'prod' ? '' : infuraKey),
  [Blockchain.Binance]: process.env.VUE_APP_WEB3_PROVIDER_BINANCE || '',
  [Blockchain.Polygon]: process.env.VUE_APP_WEB3_PROVIDER_POLYGON || '',
  [Blockchain.Fantom]: process.env.VUE_APP_WEB3_PROVIDER_FANTOM || '',
  [Blockchain.Arbitrum]: process.env.VUE_APP_WEB3_PROVIDER_ARBITRUM || '',
}

const EthereumChainIdUrl: string = process.env.VUE_APP_NETWORK_ETHEREUM || ''
const BinanceChainIdUrl: string = process.env.VUE_APP_NETWORK_BINANCE || ''
const PolygonChainIdUrl: string = process.env.VUE_APP_NETWORK_POLYGON || ''
const FantomChainIdUrl: string = process.env.VUE_APP_NETWORK_FANTOM || ''
const ArbitrumChainIdUrl: string = process.env.VUE_APP_NETWORK_ARBITRUM || ''

export const ProvidersByChainId: ProvidersByChainIdType = {
  [EthereumChainIdUrl]: process.env.VUE_APP_WEB3_PROVIDER_ETHEREUM + (process.env.VUE_APP_MODE === 'prod' ? '' : infuraKey),
  [BinanceChainIdUrl]: process.env.VUE_APP_WEB3_PROVIDER_BINANCE || '',
  [PolygonChainIdUrl]: process.env.VUE_APP_WEB3_PROVIDER_POLYGON || '',
  [FantomChainIdUrl]: process.env.VUE_APP_WEB3_PROVIDER_FANTOM || '',
  [ArbitrumChainIdUrl]: process.env.VUE_APP_WEB3_PROVIDER_ARBITRUM || '',
}
