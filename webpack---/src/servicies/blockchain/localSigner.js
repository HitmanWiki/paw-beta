import {
    getWeb3Async
} from '@/servicies/blockchain/web3'

export const localAccounts = {
    '0x9b9368d96ae65d93bee9ca588f40da75fb16149f': '0x4fdb8f894cc882f8a74a2c84fc9e8ac0a53b3a62ddb505ebb0c54a4135079b9d',
    '0x95fc53cd58a014ff0b10f39bfc2a6bb73338d6b0': '0x953807bce40c2854b63bbac288c9837ea7ad80bbd0eec9085c7812387271a835',
    '0xe7891b969e85da3a3c055d39d696087191669fea': '0xf331d8f26fd3a2c8bc07aff9ca5cca55b9f1b1fffc11c136252e69502556fb89'
}

/** Sign transaction
 * @returns {Promise<Object>} { rawTransaction: '', transactionHash: '' }
 */
export async function signTransaction(signData) {
    const web3 = await getWeb3Async({})
    const privateKey = localAccounts[signData.address.toLowerCase()]
    const tx = {
        nonce: signData.data.nonce,
        gasPrice: signData.data.gasPrice,
        gasLimit: signData.data.gasLimit,
        to: signData.data.to,
        value: signData.data.value,
        data: signData.data.data,
        chainId: signData.data.chainId
    }
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey)
    return signed
}

/** Sign arbitrary data.
 * @returns {Promise<Object>} The signed data RLP encoded signature. Example web3.eth.accounts.sign(data, privateKey);
 */
export async function signMessage({
    address,
    data
}) {
    const web3 = await getWeb3Async({})
    const privateKey = localAccounts[address.toLowerCase()]
    const res = await web3.eth.accounts.sign(data, privateKey)
    return res
}