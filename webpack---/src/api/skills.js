import {
    BACKEND_PRIVATE,
    BACKEND_PUBLIC
} from './base'

export async function getSkills() {
    return BACKEND_PUBLIC.get('/skills/list')
}

export async function getSkill(url) {
    return BACKEND_PUBLIC.get('/skills/get-by-url', {
        params: {
            url
        }
    })
}

export async function getMySkills() {
    return BACKEND_PRIVATE.get('/me/skills/list')
}

export async function setMySkills(payload) {
    return BACKEND_PRIVATE.post('/me/skills/upsert', {
        payload
    })
}