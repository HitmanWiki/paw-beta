import {
    BACKEND_PRIVATE
} from './base'

export async function getBalance() {
    return BACKEND_PRIVATE.get('/me/timewarp/earns/balance')
}

export async function getWithdraws() {
    return BACKEND_PRIVATE.get('/me/timewarp/withdraws/list')
}

export async function getReferrals(params) {
    return BACKEND_PRIVATE.get('/me/timewarp/earns/referral-details', {
        params
    })
}

export async function createWithdraw(params) {
    return BACKEND_PRIVATE.post('/me/timewarp/withdraws/create', null, {
        params
    })
}