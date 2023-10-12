import Bignumber from 'bignumber.js'
import Deferred from 'promise-deferred'
import EventEmitter from 'events'
import {
    getWeb3Async
} from '@/servicies/blockchain/web3'
import {
    Blockchain
} from '@/constants-ts/blockchain'
import {
    meCloudWalletsSignTransaction
} from '@/servicies/backend/wallets/me'
import {
    WALLET_GROUP_CLOUD,
    WALLET_GROUP_METAMASK,
    WALLET_GROUP_WALLET_CONNECT,
} from '@/constants/wallet'
import TransactionData from '@/models/TransactionData'

export async function sendTransaction1Inch({
    walletGroup = WALLET_GROUP_CLOUD,
    chainId = null,
    from,
    to,
    data,
    value,
    gasPrice,
    gas,
}) {
    let eventEmitter = null
    if ([WALLET_GROUP_WALLET_CONNECT, WALLET_GROUP_METAMASK].includes(walletGroup)) {
        const web3 = await getWeb3Async({
            walletType: walletGroup
        })
        if (walletGroup === WALLET_GROUP_METAMASK) {
            eventEmitter = web3.eth.sendTransaction({
                from,
                to,
                value: String(value || '0'),
                data,
                gasPrice,
                gas,
            })
        }
        if (walletGroup === WALLET_GROUP_WALLET_CONNECT) {
            eventEmitter = new EventEmitter()
            web3.eth.sendTransaction({
                    from,
                    to,
                    value: String(value || '0'),
                    data,
                    gasPrice,
                    gas,
                })
                .then((receipt) => {
                    eventEmitter.emit('transactionHash', receipt.transactionHash)
                })
                .catch((err) => {
                    eventEmitter.emit('error', err)
                })
        }
    }
    if (walletGroup === WALLET_GROUP_CLOUD) {
        const web3 = await getWeb3Async({
            chainId
        })
        const nonce = await web3.eth.getTransactionCount(from, 'pending')
        const signData = {
            address: from,
            data: {
                nonce: String(nonce),
                gasPrice,
                gasLimit: `0x${Number(gas || 0).toString(16)}`, // version of web3 on backend requires gasLimit in hex format
                to,
                value: String(value || '0'),
                data,
                chainId: chainId,
            },
        }
        const signed = await meCloudWalletsSignTransaction(signData)
        eventEmitter = web3.eth.sendSignedTransaction(signed.rawTransaction)
    }
    return new TransactionData({
        eventEmitter,
    })
}

export async function awaitTxBlockchain({
    blockchain = Blockchain.Ethereum,
    txId,
    chainId = null,
    blockConfirmations = 1,
}) {
    const deferred = new Deferred()
    const interv = setInterval(async () => {
        const web3 = await getWeb3Async({
            blockchain,
            chainId
        })
        const receipt = await web3.eth.getTransactionReceipt(txId)
        console.log('receipt', receipt)
        if (receipt) {
            if (receipt ? .status === false) {
                deferred.reject('receipt.status === false')
                clearInterval(interv)
                return
            }
            if (receipt.blockNumber) {
                const blockNumber = await web3.eth.getBlockNumber()
                if (blockNumber - receipt.blockNumber >= blockConfirmations) {
                    deferred.resolve()
                    clearInterval(interv)
                }
            }
        }
    }, 500)
    return deferred.promise
}