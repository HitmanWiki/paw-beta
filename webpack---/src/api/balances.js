import {
    BACKEND_PRIVATE
} from './base'

export async function getEscrowBalance() {
    const response = await BACKEND_PRIVATE.get('me/escrow/balance')
    return response
}