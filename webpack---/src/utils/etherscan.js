import {
    Blockchain,
    EXPLORERS_BY_CHAIN_ID,
    EXPLORER_URL_BY_BLOCKCHAIN,
    ChainId
} from '@/constants-ts/blockchain'

export function getTxLink({
    blockchain = Blockchain.Ethereum,
    chainId,
    tx
}) {
    if (blockchain === Blockchain.Tron) {
        return `${process.env.VUE_APP_EXPLORER_TRON}/#/transaction/${tx}`
    } else {
        if (chainId) {
            return `${EXPLORERS_BY_CHAIN_ID[chainId]}/tx/${tx}`
        }
        return `${EXPLORER_URL_BY_BLOCKCHAIN[blockchain]}/tx/${tx}`
    }
}

export function getAddressLink({
    blockchain = Blockchain.Ethereum,
    address
}) {
    return `${EXPLORER_URL_BY_BLOCKCHAIN[blockchain]}/address/${address}`
}

export function getTokenLink({
    blockchain = Blockchain.Ethereum,
    address
}) {
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[blockchain]
    return `${explorerUrl}/token/${address}`
}

export async function getSmartContractLink(blockchain = Blockchain.Ethereum) {
    const artifacts = await
    import (
        /* webpackChunkName: 'lx-contract-v1' */
        '@chronotech/laborx.sc.artifacts/contracts.v1/LaborXContract.json')
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[blockchain]
    const contractAddress = artifacts.networks[ChainId[blockchain]].address
    return getAddressLink({
        blockchain,
        address: contractAddress
    })
}