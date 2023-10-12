import BigNumber from 'bignumber.js'
import {
    getWeb3Async
} from '@/servicies/blockchain/web3'
import {
    getTimeWarpContractsRCAsync
} from '@/servicies/blockchain/artifactsAndAdresses'
import {
    getCurrency
} from '@/utils/currency'
import {
    Blockchain,
    ChainId
} from '@/constants-ts/blockchain'

let contracts = {
    [Blockchain.Ethereum]: null,
    [Blockchain.Binance]: null,
    [Blockchain.Polygon]: null,
}

export async function getTimeWarpContractAsync(blockchain = Blockchain.Ethereum) {
    const web3 = await getWeb3Async({
        blockchain
    })
    const contractsRC = await getTimeWarpContractsRCAsync()
    const address = contractsRC.networks[ChainId[blockchain]].timePool.address
    if (!contracts[blockchain]) {
        contracts[blockchain] = new web3.eth.Contract(contractsRC.abi, address)
    }
    return contracts[blockchain]
}

export async function getTimeWarpBalanceInfo({
    blockchain = Blockchain.Ethereum,
    address
} = {}) {
    const contract = await getTimeWarpContractAsync(blockchain)
    const userLock = await contract.methods.userLock(address).call()
    const TIME = getCurrency({
        value: 'TIME',
        blockchain
    })
    const info = {
        blockchain,
        address,
        userLock,
        userStacked: new BigNumber(0)
    }
    if (+userLock) {
        let userStacked = await contract.methods.userStacked(address).call()
        info.userStacked = new BigNumber(userStacked).dividedBy(TIME.baseUnits)
    }
    return info
}