import {
    BACKEND_PUBLIC
} from './base'

export async function getCountries() {
    return BACKEND_PUBLIC.get('/country/list')
}