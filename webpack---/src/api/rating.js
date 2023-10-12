import {
    BACKEND_PRIVATE
} from './base'

export async function getMeRating() {
    return BACKEND_PRIVATE.get('/me/users/rating')
}