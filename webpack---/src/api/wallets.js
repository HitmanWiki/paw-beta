import get from 'lodash/get'
import {
    BACKEND_PRIVATE
} from './base'

export async function createWallet(wallet) {
    const response = await BACKEND_PRIVATE.post(
        '/me/cloud-wallets/create', {
            payload: wallet
        },
    )
    return get(response, 'data.result')
}

export async function removeWallet({
    address,
    key
}) {
    return BACKEND_PRIVATE.delete('/me/cloud-wallets/remove', {
        data: {
            payload: {
                address,
                key
            }
        }
    })
}

export async function setDefaultWallet(address) {
    const response = await BACKEND_PRIVATE.post(
        '/me/cloud-wallets/default', {
            payload: {
                address
            }
        },
    )
    return get(response, 'data.result')
}

export async function signWallet(payload) {
    return BACKEND_PRIVATE.post('/me/cloud-wallets/sign', {
        payload
    })
}

export async function renameWallet(payload) {
    return BACKEND_PRIVATE.post('/me/cloud-wallets/rename', {
        payload
    })
}