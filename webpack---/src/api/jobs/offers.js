import {
    BACKEND_PRIVATE
} from '@/api/base'

export async function sendOffer(payload) {
    return BACKEND_PRIVATE.post('/me/jobs/simple/offers/send', {
        payload
    })
}

export async function declineOffer({
    id,
    comment
}) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/offers/decline?id=${id}`, {
        comment
    })
}

export async function applyOffer(id) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/offers/apply?id=${id}`)
}

export async function decline(id, comment) {
    return BACKEND_PRIVATE.post('/me/jobs/simple/offers/decline', {
        id,
        payload: {
            comment
        }
    })
}

export async function approve(id) {
    return BACKEND_PRIVATE.post('/me/jobs/simple/offers/apply', {
        id
    })
}

export async function getOffer(id) {
    return BACKEND_PRIVATE.get('/me/jobs/simple/offers/get', {
        params: {
            id
        }
    })
}

export async function getOffersAsFreelancer(params) {
    return BACKEND_PRIVATE.get(`/me/jobs/simple/offers/list-as-freelancer`, {
        params
    })
}

export async function getOffersAsCustomer(params) {
    return BACKEND_PRIVATE.get(`/me/jobs/simple/offers/list-as-customer`, {
        params
    })
}