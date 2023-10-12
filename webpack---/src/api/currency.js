import {
    BACKEND_PRIVATE
} from './base'

export async function getCurrencyInfo(address) {
    return BACKEND_PRIVATE.get('/currency/info', {
        params: {
            address
        }
    })
}