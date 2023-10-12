import {
    BACKEND_PUBLIC
} from './base'

export async function getList(limit = 10, offset = 0) {
    return BACKEND_PUBLIC.get('/blog/list', {
        params: {
            limit,
            offset
        }
    })
}

export async function getPost(url) {
    return BACKEND_PUBLIC.get('/blog/get', {
        params: {
            url
        }
    })
}