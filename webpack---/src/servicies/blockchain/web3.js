import {
    WALLET_GROUP_METAMASK,
    WALLET_GROUP_WALLET_CONNECT,
} from '@/constants/wallet'
import {
    getWalletProviderConnectV2Async
} from '@/servicies-ts/blockchain/provider-walletconnect-v2'
import {
    Blockchain
} from '@/constants-ts/blockchain'
import {
    ProviderByBlockchain,
    ProvidersByChainId
} from '@/constants-ts/providers'

let web3 = {}

/**
 * Pass only one parameter
 * @param chainId
 * @param blockchain
 * @param walletType
 * @returns {Promise<*>}
 */
export async function getWeb3Async({
    blockchain = Blockchain.Ethereum,
    walletType = null,
    chainId = null
}) {
    if (chainId) {
        if (!web3[`by_chain_id_${chainId}`]) {
            let Web3 = (await
                import ( /* webpackChunkName: "web3" */ 'web3')).default
            web3[`by_chain_id_${chainId}`] = new Web3(new Web3.providers.HttpProvider(ProvidersByChainId[chainId]))
            web3[`by_chain_id_${chainId}`].eth.transactionConfirmationBlocks = 1
            web3[`by_chain_id_${chainId}`].transactionPollingTimeout = 3000
            web3[`by_chain_id_${chainId}`].eth.transactionPollingTimeout = 3000
            web3[`by_chain_id_${chainId}`].eth.handleRevert = true
        }
        return web3[`by_chain_id_${chainId}`]
    }
    if (walletType) {
        if (walletType === WALLET_GROUP_WALLET_CONNECT) {
            const walletConnectProviderV2 = await getWalletProviderConnectV2Async()
            const provider = await walletConnectProviderV2.getProviderAsync()
            if (!web3['wallet_connect']) {
                const wcDisconnectListener = () => {
                    delete web3['wallet_connect']
                    walletConnectProviderV2 && walletConnectProviderV2.events.removeListener('disconnect', wcDisconnectListener)
                }
                walletConnectProviderV2 && walletConnectProviderV2.events.on('disconnect', wcDisconnectListener)
                let Web3 = (await
                    import ( /* webpackChunkName: "web3" */ 'web3')).default
                web3['wallet_connect'] = new Web3(provider)
                web3['wallet_connect'].eth.transactionConfirmationBlocks = 1
                web3['wallet_connect'].eth.transactionPollingTimeout = 3000
                web3['wallet_connect'].eth.handleRevert = true
            }
            return web3['wallet_connect']
        }

        if (walletType === WALLET_GROUP_METAMASK) {
            if (!web3['metamask']) {
                let Web3 = (await
                    import ( /* webpackChunkName: "web3" */ 'web3')).default
                web3['metamask'] = new Web3(window.ethereum)
                web3['metamask'].eth.transactionConfirmationBlocks = 1
                web3['metamask'].transactionPollingTimeout = 3000
                web3['metamask'].eth.transactionPollingTimeout = 3000
                web3['metamask'].eth.handleRevert = true
            }
            return web3['metamask']
        }
    }

    if (!web3[`by_blockchain_${blockchain}`]) {
        let Web3 = (await
            import ( /* webpackChunkName: "web3" */ 'web3')).default
        web3[`by_blockchain_${blockchain}`] = new Web3(new Web3.providers.HttpProvider(ProviderByBlockchain[blockchain]))
        web3[`by_blockchain_${blockchain}`].eth.transactionConfirmationBlocks = 1
        web3[`by_blockchain_${blockchain}`].transactionPollingTimeout = 3000
        web3[`by_blockchain_${blockchain}`].eth.transactionPollingTimeout = 3000
        web3[`by_blockchain_${blockchain}`].eth.handleRevert = true
    }
    return web3[`by_blockchain_${blockchain}`]
}