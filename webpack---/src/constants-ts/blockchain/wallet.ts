import { EVM_ZERO_ADDRESS, TVM_ZERO_ADDRESS } from './common'

export enum WalletGroup {
  Cloud = 1,
  Metamask = 2,
  WalletConnect = 4,
  TronLink = 5,
}

export function getNameByWalletGroup (walletGroup: WalletGroup): string {
  switch (walletGroup) {
    case WalletGroup.WalletConnect:
      return 'Wallet Connect'
    case WalletGroup.Metamask:
      return 'Metamask'
    case WalletGroup.Cloud:
      return 'Cloud Wallet'
    case WalletGroup.TronLink:
      return 'TronLink'
    default:
      return ''
  }
}

export function getZeroAddressByWalletGroup (walletGroup: WalletGroup): string {
  switch (walletGroup) {
    case WalletGroup.WalletConnect:
      return EVM_ZERO_ADDRESS
    case WalletGroup.Metamask:
      return EVM_ZERO_ADDRESS
    case WalletGroup.Cloud:
      return EVM_ZERO_ADDRESS
    case WalletGroup.TronLink:
      return TVM_ZERO_ADDRESS
    default:
      return EVM_ZERO_ADDRESS
  }
}

export const WALLET_GROUP_CLOUD = 1
export const WALLET_GROUP_METAMASK = 2
export const WALLET_GROUP_WALLET_CONNECT = 4
export const WALLET_GROUP_TRON_LINK = 5
