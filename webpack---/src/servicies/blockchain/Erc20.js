import BigNumber from 'bignumber.js'
import {
    getWeb3Async
} from '@/servicies/blockchain/web3'
import {
    getERC20AbiAsync,
} from '@/servicies/blockchain/artifactsAndAdresses'
import {
    CURRENCIES
} from '@/constants-ts/currency'
import {
    Blockchain
} from '@/constants-ts/blockchain'

let erc20Map = {
    [`blockchain_${Blockchain.Ethereum}`]: {},
    [`blockchain_${Blockchain.Binance}`]: {},
    [`blockchain_${Blockchain.Polygon}`]: {},
    [`blockchain_${Blockchain.Fantom}`]: {},
    [`blockchain_${Blockchain.Arbitrum}`]: {},
    [`chainId_${56}`]: {},
    [`chainId_${1337}`]: {},
    [`chainId_${1}`]: {},
    [`chainId_${4}`]: {},
    [`chainId_${97}`]: {},
    [`chainId_${137}`]: {},
    [`chainId_${80001}`]: {},
    [`chainId_${250}`]: {},
    [`chainId_${4002}`]: {},
    [`chainId_${42161}`]: {},
    [`chainId_${421613}`]: {},
}

// ------------- ERC20 tokens ------------------
export async function getErc20ContractAsync({
    blockchain = Blockchain.Ethereum,
    currencyName = 'USDT',
    chainId,
    erc20Address
}) {
    const web3 = await getWeb3Async({
        blockchain,
        chainId
    })
    const artifacts = await getERC20AbiAsync(currencyName)
    const address = erc20Address || CURRENCIES.find(
        item => item.name === currencyName && item.blockchain === blockchain).address
    if (chainId) {
        if (!erc20Map[`chainId_${chainId}`][address]) {
            erc20Map[`chainId_${chainId}`][address] = new web3.eth.Contract(artifacts, address)
        }
        return erc20Map[`chainId_${chainId}`][address]
    }
    if (blockchain) {
        if (!erc20Map[`blockchain_${blockchain}`][address]) {
            erc20Map[`blockchain_${blockchain}`][address] = new web3.eth.Contract(artifacts, address)
        }
        return erc20Map[`blockchain_${blockchain}`][address]
    }
}

export async function balanceOf({
    blockchain = Blockchain.Ethereum,
    chainId,
    owner,
    currencyName = 'USDT',
    erc20Address
}) {
    const contract = await getErc20ContractAsync({
        blockchain,
        currencyName,
        chainId,
        erc20Address
    })
    const value = await contract.methods.balanceOf(owner).call()
    if (value === null) {
        return new BigNumber(0)
    }
    return value
}