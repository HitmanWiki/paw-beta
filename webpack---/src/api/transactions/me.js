import {
    BACKEND_PRIVATE
} from '../base'

export async function meTransactionCreate(payload) {
    return BACKEND_PRIVATE.post('/me/transactions/create', {
        payload
    })
}

export async function getTransaction({
    scId,
    txId,
    event,
    blockchain
}) {
    return BACKEND_PRIVATE.get(
        '/me/transactions/get', {
            params: (scId ? {
                scId,
                event,
                blockchain
            } : {
                txId,
                event,
                blockchain
            })
        }
    )
}

export async function getList({
    limit,
    offset,
    status,
    event
}) {
    return BACKEND_PRIVATE.get('/me/transactions/list', {
        params: {
            limit,
            offset,
            status,
            event
        }
    })
}