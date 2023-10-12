import {
    BACKEND_PUBLIC
} from './base'

export async function getServerTime() {
    return BACKEND_PUBLIC.get('/site/time')
}