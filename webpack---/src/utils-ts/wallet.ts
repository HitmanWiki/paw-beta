import Wallet from '@/models-ts/Wallet'
import { Blockchain, WalletGroup } from '@/constants-ts/blockchain'

export function getBlockchainIcon (blockchain: Blockchain | string) {
  switch (Number(blockchain)) {
    case Blockchain.Ethereum: return 'blockchain-circle-ethereum'
    case Blockchain.Binance: return 'blockchain-circle-bsc'
    case Blockchain.Polygon: return 'blockchain-circle-polygon'
    case Blockchain.Fantom: return 'blockchain-circle-fantom'
    case Blockchain.Arbitrum: return 'blockchain-circle-arbitrum'
    case Blockchain.Tron: return '/static/images/blockchain/icon-tron-circle.png'
  }
}

export function getWalletIcon (wallet: any): string {
  const group = typeof wallet === 'object'
    ? wallet.group
    : wallet
  switch (group) {
    case WalletGroup.Metamask: return '/static/images/wallets/metamask-wallet.svg'
    case WalletGroup.WalletConnect: return '/static/images/wallets/wallet-connect.png'
    case WalletGroup.TronLink: return '/static/images/wallets/tron-wallet.png'
    default: return '/static/images/wallets/cloud-wallet.svg'
  }
}

export function getWalletGroupName (wallet: any): string {
  const group = typeof wallet === 'object'
    ? wallet.group
    : wallet
  switch (group) {
    case WalletGroup.Metamask:
      return 'Metamask'
    case WalletGroup.WalletConnect:
      return 'WalletConnect'
    case WalletGroup.Cloud:
      return 'Cloud wallet'
    case WalletGroup.TronLink:
      return 'TronLink'
    default:
      return ''
  }
}

export function getFreelancerWalletForContract (wallets: Wallet[], requiredWalletGroup: WalletGroup): Wallet | null {
  const defaultWallet: Wallet = wallets.find((item: Wallet) => item.is_default === 1)!
  if (requiredWalletGroup === WalletGroup.TronLink) {
    if (defaultWallet?.group === WalletGroup.TronLink) {
      return defaultWallet
    } else {
      const tronWallet: Wallet | undefined = wallets.find((item: Wallet) => item.group === WalletGroup.TronLink)
      if (tronWallet) {
        return tronWallet
      }
    }
  } else {
    if (defaultWallet?.group === WalletGroup.TronLink) {
      const cloudWallet: Wallet = wallets.find((item: Wallet) => item.group === WalletGroup.Cloud)!
      return cloudWallet
    } else {
      return defaultWallet
    }
  }
  return null
}
