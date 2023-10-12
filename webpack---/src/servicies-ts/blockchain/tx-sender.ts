import { WalletGroup } from '@/constants-ts/blockchain'
import { meCloudWalletsSignTransaction } from '@/servicies/backend/wallets/me'
import getWeb3InstanceAsync from '@/servicies-ts/blockchain/web3'
import { EventEmitter } from 'events'

export async function txSend (
  {
    walletGroup,
    chainId,
    from,
    to,
    value = '0',
    encodedAbi,
    gasPrice,
    gasLimit,
  }
    : {
    walletGroup: WalletGroup,
    chainId?: number,
    from: string,
    to: string,
    value: string,
    encodedAbi: string,
    gasPrice: string,
    gasLimit: number
  }
): Promise<any> {
  let eventEmitter: any
  if (walletGroup === WalletGroup.Cloud) {
    const web3 = await getWeb3InstanceAsync({ chainId })
    const nonce = await web3.eth.getTransactionCount(from, 'pending')
    const signData = {
      address: from,
      data: {
        nonce: String(nonce),
        gasPrice,
        gasLimit: `0x${gasLimit.toString(16)}`, // version of web3 on backend requires gasLimit in hex format
        to,
        value,
        data: encodedAbi,
        chainId,
      },
    }
    const signed: any = await meCloudWalletsSignTransaction(signData)
    eventEmitter = web3.eth.sendSignedTransaction(signed.rawTransaction)
  }
  if (walletGroup === WalletGroup.Metamask) {
    const web3 = await getWeb3InstanceAsync({ walletGroup })
    eventEmitter = web3.eth.sendTransaction({
      from,
      to,
      value,
      data: encodedAbi,
      gasPrice: gasPrice,
      gas: gasLimit,
    })
  }
  if (walletGroup === WalletGroup.WalletConnect) {
    const web3 = await getWeb3InstanceAsync({ walletGroup })
    eventEmitter = new EventEmitter()
    web3.eth.sendTransaction({
      chainId,
      from,
      to,
      value,
      data: encodedAbi,
      gasPrice: gasPrice,
      gas: gasLimit,
    })
      .on('transactionHash', (hash) => {
        eventEmitter.emit('transactionHash', hash)
      })
      .on('error', (error) => {
        eventEmitter.emit('error', error)
      })
  }
  return { eventEmitter }
}
