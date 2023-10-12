import {
    BACKEND_PRIVATE
} from './base'

export async function getProfileInfo() {
    const data = await BACKEND_PRIVATE.get('/me/dashboard/profile')
    return data
}