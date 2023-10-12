import {
    getTransaction
} from '@/servicies/backend/transactions/me'
import {
    STATUS_APPLIED
} from '@/constants/backend/transaction'
import Deferred from 'promise-deferred'
import {
    awaitTxBlockchain
} from '@/servicies/blockchain/common'
import {
    Blockchain
} from '@/constants-ts/blockchain'
import {
    awaitTxBlockchain as awaitTxBlockchainTron
} from '@/servicies-ts/blockchain/tron/common'

export async function awaitTxBackend({
    blockchain = Blockchain.Ethereum,
    txId,
    scId,
    event,
}) {
    const deferred = new Deferred()
    const interv = setInterval(async () => {
        getTransaction({
                scId,
                txId,
                event,
                blockchain
            })
            .then((transaction) => {
                console.log('Transaction backend', transaction)
                if (transaction.status === STATUS_APPLIED) {
                    clearInterval(interv)
                    deferred.resolve()
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }, 500)
    return deferred.promise
}

export async function awaitTxCombined({
    blockchain = Blockchain.Ethereum,
    txId,
    scId,
    event,
}) {
    if (blockchain === Blockchain.Tron) {
        await awaitTxBlockchainTron({
            txId
        })
    } else {
        await awaitTxBlockchain({
            blockchain,
            txId
        })
    }

    const deferred = new Deferred()
    const interv = setInterval(async () => {
        getTransaction({
                scId,
                txId,
                event,
                blockchain
            })
            .then((transaction) => {
                console.log('Transaction backend', transaction)
                if (transaction.status === STATUS_APPLIED) {
                    clearInterval(interv)
                    deferred.resolve()
                }
            })
            .catch((err) => {
                console.error(err)
            })
    }, 500)
    return deferred.promise
}