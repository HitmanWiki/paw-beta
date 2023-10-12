import { Blockchain } from './common'

export const BlockchainNames = {
  undefined: '',
  [Blockchain.Ethereum]: 'Ethereum',
  [Blockchain.Binance]: 'BNB Chain',
  [Blockchain.Polygon]: 'Polygon',
  [Blockchain.Fantom]: 'Fantom',
  [Blockchain.Arbitrum]: 'Arbitrum',
  [Blockchain.Tron]: 'Tron',
}

export const getBlockchainNameByChainId = (chainId?: number) => {
  switch (chainId) {
    case 1:
      return 'Ethereum'
    case 3:
      return 'Ropsten'
    case 42:
      return 'Kovan'
    case 4:
      return 'Rinkeby'
    case 5:
      return 'Goerli'
    case 56:
      return 'BNB Chain'
    case 97:
      return 'BNB Chain Testnet'
    case 137:
      return 'Polygon'
    case 80001:
      return 'Polygon Testnet'
    case 250:
      return 'Fantom'
    case 4002:
      return 'Fantom Testnet'
    case 42161:
      return 'Arbitrum'
    case 421613:
      return 'Arbitrum Goerli'
  }
  return 'Not found'
}
