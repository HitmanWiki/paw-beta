import {
    BACKEND_PUBLIC
} from './base'

export async function getLandingData() {
    return BACKEND_PUBLIC.get('/site/landing-data')
}

export async function getLandingCopyData() {
    return BACKEND_PUBLIC.get('/site/landing-data-2')
}