import {
    BACKEND_PUBLIC
} from './base'

export async function getRates() {
    return BACKEND_PUBLIC.get('/rates')
}