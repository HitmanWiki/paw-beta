import EventEmitter from 'events'
import {
    WALLET_GROUP_METAMASK
} from '@/constants/wallet'
import {
    getRandomString
} from '@/utils/strings'
import {
    getServerTime
} from '@/api/site'
import {
    getWeb3Async
} from '@/servicies/blockchain/web3'
import {
    Blockchain
} from '@/constants-ts/blockchain'

const ethereum = (typeof window !== 'undefined') && window.ethereum

export let eventEmitter = new EventEmitter()

if (ethereum) {
    ethereum.autoRefreshOnNetworkChange = false

    ethereum.on('accountsChanged', async (accounts) => {
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            const web3 = await getWeb3Async({})
            eventEmitter.emit(
                'accountsChanged',
                accounts.map(item => web3.utils.toChecksumAddress(item))
            )
        }
        if (accounts && Array.isArray(accounts) && accounts.length === 0) {
            eventEmitter.emit('disconnect')
        }
    })

    ethereum.on('chainChanged', (chainId) => {
        if (chainId) {
            eventEmitter.emit('chainChanged', parseInt(chainId, 16))
        }
    })

    ethereum.on('connect', () => {
        eventEmitter.emit('connect')
    })

    ethereum.on('disconnect', () => {
        eventEmitter.emit('disconnect')
    })
}

export function isActive() {
    return !!ethereum && ethereum.isMetaMask
}

export async function getAddress({
    blockchain = Blockchain.Ethereum,
    chainId = null
}) {
    if (isActive()) {
        const web3 = await getWeb3Async({
            blockchain,
            chainId
        })
        const accounts = await ethereum.request({
            method: 'eth_requestAccounts'
        })
        return web3.utils.toChecksumAddress(accounts[0])
    } else {
        return null
    }
}

export async function getChainId() {
    if (isActive()) {
        const chainId = await ethereum.request({
            method: 'net_version'
        })
        return parseInt(chainId)
    } else {
        return null
    }
}

export async function getSignPhrase() {
    const address = await getAddress({})
    if (address) {
        const web3 = await getWeb3Async({
            walletType: WALLET_GROUP_METAMASK
        })
        let timestamp
        try {
            const time = await getServerTime()
            timestamp = time.timestamp
        } catch (e) {
            console.error(e)
            timestamp = String(Number(new Date((new Date()).toUTCString()))).slice(0, -3) // timestamp in seconds
        }
        const message = JSON.stringify({
            timestamp,
            message: getRandomString()
        })
        const signature = await web3.eth.personal.sign(message, address)
        return {
            address,
            message,
            signature
        }
    }
}