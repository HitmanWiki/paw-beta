import {
    BACKEND_PRIVATE
} from './base'

export async function getNotifications(limit, offset) {
    return BACKEND_PRIVATE.get('/me/notifications/list', {
        params: {
            limit: limit,
            offset: offset
        }
    })
}

export async function getUnreadNotificationsCount() {
    return BACKEND_PRIVATE.get('/me/notifications/unread')
}

export async function readNotifications(ids) {
    return BACKEND_PRIVATE.post('/me/notifications/read', {
        payload: {
            ids
        }
    })
}