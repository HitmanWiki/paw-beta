import { Blockchain, ChainId, WalletGroup } from '@/constants-ts/blockchain'
import Web3Type from 'web3/types'
import { ProvidersByChainId } from '@/constants-ts/providers'
import {
  getWalletProviderConnectV2Async,
  WalletConnectProviderV2
} from '@/servicies-ts/blockchain/provider-walletconnect-v2'

declare global {
  interface Window {
    ethereum: any;
  }
}

type Web3Instances = {
  [key: string]: Web3Type
}

let web3: Web3Instances = {}

function setupWeb3 (web3: Web3Type) {
  web3.eth.transactionConfirmationBlocks = 1
  web3.eth.transactionPollingTimeout = 3000
  web3.eth.handleRevert = true
}

export default async function getWeb3InstanceAsync (
  {
    walletGroup,
    chainId = Number(ChainId[Blockchain.Ethereum]),
  }
    : {
    walletGroup?: WalletGroup,
    chainId?: number
  }
): Promise<Web3Type> {
  let key: string
  if (walletGroup) {
    if (walletGroup === WalletGroup.WalletConnect) {
      key = 'wallet_connect'
      const walletConnectProviderV2 = await getWalletProviderConnectV2Async()
      const provider: any = await walletConnectProviderV2.getProviderAsync()
      if (!web3[key]) {
        const wcDisconnectListener = () => {
          delete web3[key]
          walletConnectProviderV2 && walletConnectProviderV2.events.removeListener('disconnect', wcDisconnectListener)
        }
        walletConnectProviderV2 && walletConnectProviderV2.events.on('disconnect', wcDisconnectListener)
        let Web3 = (await import(/* webpackChunkName: "web3" */ 'web3')).default
        web3[key] = new Web3(provider)
      }
      return web3[key]
    }

    if (walletGroup === WalletGroup.Metamask) {
      key = 'metamask'
      if (!web3[key]) {
        let Web3 = (await import(/* webpackChunkName: "web3" */ 'web3')).default
        web3[key] = new Web3(window.ethereum)
        setupWeb3(web3[key])
      }
      return web3[key]
    }
  }
  key = `by_chain_id_${chainId}`
  if (!web3[key]) {
    let Web3 = (await import(/* webpackChunkName: "web3" */ 'web3')).default
    web3[key] = new Web3(new Web3.providers.HttpProvider(ProvidersByChainId[chainId]))
    setupWeb3(web3[key])
  }
  return web3[key]
}
