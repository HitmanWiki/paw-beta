import {
    getTransaction as getTransactionApi
} from '@/api/transactions/me'
import TransactionBackend from '@/models/backend/TransactionBackend'
import {
    Blockchain
} from '@/constants-ts/blockchain'

export async function getTransaction({
    scId,
    txId,
    event,
    blockchain = Blockchain.Ethereum
}) {
    const result = await getTransactionApi({
        scId,
        txId,
        event,
        blockchain
    })
    return TransactionBackend.fromServer(result)
}