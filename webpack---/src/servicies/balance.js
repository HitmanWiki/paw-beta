import {
    getWeb3Async
} from '@/servicies/blockchain/web3'
import {
    balanceOf,
    getErc20ContractAsync
} from '@/servicies/blockchain/Erc20'
import {
    Blockchain
} from '@/constants-ts/blockchain'

/** Get eth address balance
 * @param blockchain
 * @param chainId
 * @param address
 * @param currencyName
 * @param erc20Address
 * @returns {Promise<string>} balance in wei
 */
export async function getBalance({
    blockchain = Blockchain.Ethereum,
    chainId,
    address,
    currencyName = 'ETH',
    erc20Address
}) {
    if (!address) return null
    if ((currencyName === 'ETH' && ((blockchain === Blockchain.Ethereum) || ([1, 4, 1337].includes(chainId)))) || // TODO
        (currencyName === 'BNB' && ((blockchain === Blockchain.Binance) || ([56, 97].includes(chainId))))) {
        return getBalanceETH({
            blockchain,
            address,
            chainId
        })
    } else {
        return getBalanceErc20({
            blockchain,
            address,
            currencyName,
            chainId,
            erc20Address
        })
    }
}

export async function getBalances({
    blockchain = Blockchain.Ethereum,
    chainId,
    address,
    tokens
}) {
    const web3 = await getWeb3Async({
        blockchain,
        chainId
    })
    const batch = new web3.BatchRequest()
    const balances = {}
    const requests = []
    const callback = (token, resolve) => (err, data) => {
        if (err) {
            console.error(`Error fetching ${token.name} balance`, err)
        } else {
            balances[token.name] = data || '0'
        }
        return resolve(balances[token.name])
    }
    for (let token of tokens) {
        balances[token.name] = '0'
        const isETH = token.name === 'ETH' && ((blockchain === Blockchain.Ethereum) || ([1, 4, 1337].includes(chainId)))
        const isBNB = token.name === 'BNB' && ((blockchain === Blockchain.Binance) || ([56, 97].includes(chainId)))
        const isMATIC = token.name === 'MATIC' && ((blockchain === Blockchain.Polygon) || ([80001, 137].includes(chainId)))
        const isFTM = token.name === 'FTM' && ((blockchain === Blockchain.Fantom) || ([4002, 250].includes(chainId)))
        const isARB_ETH = token.name === 'ETH' && ((blockchain === Blockchain.Arbitrum) || ([42161, 421613].includes(chainId)))
        let request
        if (isETH || isBNB || isMATIC || isFTM || isARB_ETH) {
            request = new Promise((resolve) => batch.add(web3.eth.getBalance.request(address, callback(token, resolve))))
        } else {
            const contract = await getErc20ContractAsync({
                blockchain,
                erc20Address: token.address,
                currencyName: token.name,
                chainId
            })
            request = new Promise((resolve) => batch.add(contract.methods.balanceOf(address).call.request({}, callback(token, resolve))))
        }
        requests.push(request)
    }
    batch.execute()
    await Promise.all(requests)
    return balances
}

export async function getBalanceETH({
    blockchain = Blockchain.Ethereum,
    chainId,
    address
}) {
    const web3 = await getWeb3Async({
        blockchain,
        chainId
    })
    const balance = await web3.eth.getBalance(address)
    return balance
}

export async function getBalanceErc20({
    blockchain = Blockchain.Ethereum,
    chainId,
    address,
    currencyName,
    erc20Address
}) {
    const balance = await balanceOf({
        blockchain,
        chainId,
        owner: address,
        currencyName,
        erc20Address
    })
    return balance.toString()
}