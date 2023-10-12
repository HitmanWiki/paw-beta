import {
    BACKEND_PRIVATE
} from '@/api/base'

export async function sendApplication(payload) {
    return BACKEND_PRIVATE.post('/me/jobs/simple/applications/create-combined-as-freelancer', {
        payload
    })
}

export async function declineApplicationAsFreelancer(id) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/applications/decline-as-freelancer?id=${id}`)
}

export async function declineApplicationAsCustomer(id) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/applications/decline-as-customer?id=${id}`)
}

export async function getApplication(id) {
    return BACKEND_PRIVATE.get('/me/jobs/simple/applications/get', {
        params: {
            id
        }
    })
}

export async function readApplications(ids) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/applications/mark-read`, null, {
        params: {
            ids
        }
    })
}

export async function setApplicationMeta(id, meta) {
    return BACKEND_PRIVATE.post('/me/jobs/simple/applications/upsert-tabs-meta', {
        id,
        meta
    })
}