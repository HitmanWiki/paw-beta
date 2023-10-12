import {
    BACKEND_PRIVATE,
    BACKEND_PUBLIC,
    BACKEND_LOYAL
} from './base'

export async function getRoles() {
    return BACKEND_PUBLIC.get('/primary-roles/list')
}

export async function getCategoryRoles() {
    return BACKEND_PUBLIC.get('/primary-role-categories/list')
}

export async function createVacancy(payload) {
    return BACKEND_PRIVATE.post('/me/vacancy/create', {
        payload
    })
}

export async function updateVacancy(id, payload) {
    return BACKEND_PRIVATE.put('/me/vacancy/edit', {
        id,
        payload
    })
}

export async function publishVacancy(id) {
    return BACKEND_PRIVATE.post('/me/vacancy/publish', {
        id
    })
}

export async function unpublishVacancy(id) {
    return BACKEND_PRIVATE.post('/me/vacancy/unpublish', {
        id
    })
}

export async function deleteVacancy(id) {
    return BACKEND_PRIVATE.delete('/me/vacancy/remove', {
        data: {
            id
        }
    })
}

export async function getVacancy(id) {
    return BACKEND_LOYAL.get('/vacancy/get', {
        params: {
            id
        }
    })
}

export async function getMyPostedVacancies(limit = 10, offset = 0) {
    return BACKEND_PRIVATE.get('/me/vacancy/list-posted', {
        params: {
            limit,
            offset
        }
    })
}

export async function getMyDraftsVacancies(limit = 10, offset = 0) {
    return BACKEND_PRIVATE.get('/me/vacancy/list-drafted', {
        params: {
            limit,
            offset
        }
    })
}

export async function getMyCompletedVacancies(limit = 10, offset = 0) {
    return BACKEND_PRIVATE.get('/me/vacancy/list-completed', {
        params: {
            limit,
            offset
        }
    })
}

export async function getMyFreelancerApplications(params) {
    return BACKEND_PRIVATE.get('/me/vacancy/applications/list-as-freelancer', {
        params
    })
}

export async function getVacancies(params) {
    return BACKEND_LOYAL.get('/vacancy/list', {
        params
    })
}

export async function getCvs() {
    return BACKEND_PRIVATE.get('/me/freelancer/cv-list')
}

export async function archiveVacancy(id) {
    return BACKEND_PRIVATE.post('/me/vacancy/archive', {
        id
    })
}