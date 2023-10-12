import {
    BACKEND_PRIVATE
} from '@/api/base'

export async function sendApplication(payload) {
    return BACKEND_PRIVATE.post('/me/vacancy/applications/create-as-freelancer', {
        payload
    })
}

export async function declineApplicationAsFreelancer(id) {
    return BACKEND_PRIVATE.post(`/me/vacancy/applications/decline-as-freelancer?id=${id}`)
}

export async function declineApplicationAsCustomer(id) {
    return BACKEND_PRIVATE.post(`/me/vacancy/applications/decline-as-customer?id=${id}`)
}

export async function readApplications(ids) {
    return BACKEND_PRIVATE.post(`/me/vacancy/applications/mark-read`, null, {
        params: {
            ids
        }
    })
}

export async function getApplication(id) {
    return BACKEND_PRIVATE.get('/me/vacancy/applications/get', {
        params: {
            id
        }
    })
}

export async function applyApplication(id) {
    return BACKEND_PRIVATE.post('/me/vacancy/applications/apply', null, {
        params: {
            id
        }
    })
}

export async function setInProgressApplication(id) {
    return BACKEND_PRIVATE.post('/me/vacancy/applications/in-progress', null, {
        params: {
            id
        }
    })
}