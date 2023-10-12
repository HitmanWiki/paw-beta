import {
    BACKEND_PRIVATE,
    BACKEND_PUBLIC,
    BACKEND_LOYAL
} from './base'

export async function getBase64Image(url) {
    const data = await BACKEND_PUBLIC.get('/images/to-base64', {
        params: {
            url
        }
    })
    return data
}

export async function createService(payload) {
    const data = await BACKEND_PRIVATE.post('/me/gig/create', {
        payload
    })
    return data
}

export async function editService(id, payload) {
    const data = await BACKEND_PRIVATE.put('/me/gig/edit', {
        id,
        payload
    })
    return data
}

export async function getService(id) {
    return BACKEND_LOYAL.get('/gig/get', {
        params: {
            id
        }
    })
}

export async function publishService(id) {
    return BACKEND_PRIVATE.post('/me/gig/publish', {
        id
    })
}

export async function unpublishService(id) {
    return BACKEND_PRIVATE.post('/me/gig/unpublish', {
        id
    })
}

export async function getMyServices(limit, page, status) {
    return BACKEND_PRIVATE.get('/me/gig/list', {
        params: {
            limit: limit,
            offset: page,
            status
        }
    })
}

export async function getFreelancerOffers(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/freelancer/offers', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getFreelancerNegotiationsOffers(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/applications/negotiations-as-freelancer', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getFreelancerInProgress(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/freelancer/in-progress', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getFreelancerCompleted(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/freelancer/completed', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getCustomerNegotiationsOffers(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/applications/negotiations-as-customer', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getCustomerInProgressOffers(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/customer/in-progress', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getCustomerOffers(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/customer/offers', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getCustomerInProgress(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/customer/in-progress', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getCustomerCompleted(limit, page) {
    return BACKEND_PRIVATE.get('/me/gigs/customer/completed', {
        params: {
            limit: limit,
            offset: page
        }
    })
}

export async function getGigOffer(id) {
    return BACKEND_PRIVATE.get('/me/gigs/offers/get', {
        params: {
            id
        }
    })
}

export async function deleteService(id) {
    return BACKEND_PRIVATE.delete('/me/gig/remove', {
        data: {
            id
        }
    })
}

export async function getGigs(params) {
    return BACKEND_PUBLIC.get('gig/list-by-rating', {
        params
    })
}

export async function getServices(params) {
    return BACKEND_PUBLIC.get('gig/list-by-skill', {
        params
    })
}

export async function getGigsList(params) {
    return BACKEND_PUBLIC.get('gig/list', {
        params
    })
}

export async function sendOffer(payload) {
    return BACKEND_PRIVATE.post('/me/gigs/offers/send', {
        payload
    })
}

export async function applyOffer(id) {
    return BACKEND_PRIVATE.post(`/me/gigs/offers/apply?id=${id}`)
}

export async function declineOffer({
    id,
    comment
}) {
    return BACKEND_PRIVATE.post(`/me/gigs/offers/decline?id=${id}`, {
        comment
    })
}

export async function startDispute({
    id,
    comment
}) {
    return BACKEND_PRIVATE.post(`/me/gigs/jobs/block?id=${id}`, {
        comment
    })
}

export async function getGigJob(id) {
    return BACKEND_PRIVATE.get('me/gigs/jobs/get', {
        params: {
            id
        }
    })
}

export async function getApplication(id) {
    return BACKEND_PRIVATE.get('/me/gigs/applications/get', {
        params: {
            id
        }
    })
}

export async function sendApplication(payload) {
    return BACKEND_PRIVATE.post('/me/gigs/applications/create-as-customer', {
        payload
    })
}

export async function declineApplicationAsCustomer({
    id,
    reason
}) {
    return BACKEND_PRIVATE.post(`/me/gigs/applications/decline-as-customer?id=${id}`, {
        reason
    })
}

export async function declineApplicationAsFreelancer({
    id,
    reason
}) {
    return BACKEND_PRIVATE.post(`/me/gigs/applications/decline-as-freelancer?id=${id}`, {
        reason
    })
}

export async function doneGig(id) {
    return BACKEND_PRIVATE.post(`/me/gigs/jobs/mark-done?id=${id}`)
}

export async function cancelDoneGig(id) {
    return BACKEND_PRIVATE.post(`/me/gigs/jobs/mark-not-done?id=${id}`)
}

export async function getOffersAsFreelancer(params) {
    return BACKEND_PRIVATE.get(`/me/gigs/offers/list-as-freelancer`, {
        params
    })
}

export async function getOffersAsCustomer(params) {
    return BACKEND_PRIVATE.get(`/me/gigs/offers/list-as-customer`, {
        params
    })
}

export async function getRecommendedGigs({
    limit,
    offset
}) {
    return BACKEND_PRIVATE.get('/me/gig/list-of-recommended', {
        params: {
            limit: limit,
            offset: offset
        }
    })
}

export async function readApplications(ids) {
    return BACKEND_PRIVATE.post(`/me/gigs/applications/mark-read`, null, {
        params: {
            ids
        }
    })
}