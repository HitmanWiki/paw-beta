export enum Blockchain {
  Ethereum = 1,
  Binance = 2,
  Polygon = 3,
  Tron = 4,
  Fantom = 5,
  Arbitrum = 6,
}

export const EVM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TVM_ZERO_ADDRESS = 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb'

export const BLOCKCHAIN_OPTIONS = [
  { name: 'Ethereum Blockchain', value: Blockchain.Ethereum },
  { name: 'BNB Chain', value: Blockchain.Binance },
  { name: 'Polygon', value: Blockchain.Polygon },
  { name: 'Fantom', value: Blockchain.Fantom },
  { name: 'Arbitrum', value: Blockchain.Arbitrum },
  { name: 'Tron', value: Blockchain.Tron },
]

export const EVM_BLOCKCHAIN = [Blockchain.Ethereum, Blockchain.Binance, Blockchain.Polygon, Blockchain.Fantom, Blockchain.Arbitrum]

export const BLOCKCHAIN_OPTIONS_EVM = [
  { name: 'Ethereum', value: Blockchain.Ethereum },
  { name: 'BNB Chain', value: Blockchain.Binance },
  { name: 'Polygon', value: Blockchain.Polygon },
  { name: 'Fantom', value: Blockchain.Fantom },
  { name: 'Arbitrum', value: Blockchain.Arbitrum },
]

export function getTronArtifactsNameByNode (node: string): string {
  switch (node) {
    case 'https://api.trongrid.io':
      return 'tron-mainnet'
    case 'https://api.shasta.trongrid.io':
      return 'tron-shasta'
    default:
      return 'tron-mainnet'
  }
}
