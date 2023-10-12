import {
    BACKEND_PRIVATE
} from './base'

export async function authenticate() {
    return BACKEND_PRIVATE.post('me/chats/authenticate')
}

export async function createRoom({
    userId,
    accountType,
    meta
}) {
    return BACKEND_PRIVATE.post('me/chats/create-room', {
        payload: {
            user_id: userId,
            account_type: accountType,
            meta
        }
    })
}

export async function closeRoom(room_id) {
    return BACKEND_PRIVATE.post('/me/chats/close-room', {
        payload: {
            room_id
        }
    })
}