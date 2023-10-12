import {
    BACKEND_PRIVATE
} from '@/api/base'

export async function addBookmark(payload) {
    return BACKEND_PRIVATE.post('/me/bookmarks/add', payload)
}

export async function removeBookmark(id) {
    return BACKEND_PRIVATE.delete(`/me/bookmarks/remove?id=${id}`)
}

export async function loadBookmarksVacancies(params) {
    return BACKEND_PRIVATE.get('/me/bookmarks/list-vacancy', {
        params
    })
}

export async function loadBookmarksJobs(params) {
    return BACKEND_PRIVATE.get(`/me/bookmarks/list-jobs`, {
        params
    })
}

export async function loadBookmarksGigs(params) {
    return BACKEND_PRIVATE.get('/me/bookmarks/list-gigs', {
        params
    })
}