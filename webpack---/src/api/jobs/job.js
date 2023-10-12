import {
    BACKEND_PRIVATE,
    BACKEND_LOYAL
} from '@/api/base'

export async function createJob(payload) {
    return BACKEND_PRIVATE.post('/me/simple-jobs/create', {
        payload
    })
}

export async function getJob(id) {
    return BACKEND_LOYAL.get('/simple-jobs/get', {
        params: {
            id
        }
    })
}

export async function editJob(id, payload) {
    return BACKEND_PRIVATE.put('/me/simple-jobs/edit', {
        id,
        payload
    })
}

export async function publishJob(id) {
    return BACKEND_PRIVATE.post(`/me/simple-jobs/publish?id=${id}`)
}

export async function unpublishJob(id) {
    return BACKEND_PRIVATE.post(`/me/simple-jobs/unpublish?id=${id}`)
}

export async function removeJob(id) {
    return BACKEND_PRIVATE.delete('/me/simple-jobs/remove', {
        data: {
            id
        }
    })
}

export async function startDispute({
    id,
    comment
}) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/jobs/block?id=${id}`, {
        comment
    })
}

export async function doneJob(id) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/jobs/mark-done?id=${id}`)
}

export async function cancelDoneJob(id) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/jobs/mark-not-done?id=${id}`)
}

export async function unlockJobRoom(id) {
    return BACKEND_PRIVATE.post(`/me/jobs/simple/jobs/unlock-room?roomId=${id}`)
}