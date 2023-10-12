import Deferred from 'promise-deferred'
import {
    signTransaction,
    signMessage
} from '@/servicies/blockchain/localSigner'
import {
    signWallet
} from '@/api/wallets'
import ErrorMatcher from '@/utils/ErrorMatcher'
import storeFromContext from '@/store/storeFromContext'

/** Sign transaction
 * @param payload Sign model object
 * @returns {Promise<String>} Return signed transaction signature
 */
export async function meCloudWalletsSignTransaction(payload) {
    if (process.env.VUE_APP_DEBUG_SC_MODE === '1') {
        const signedTransaction = await signTransaction(payload)
        return signedTransaction
    } else {
        return signTransactionWith2FA(payload)
    }
}

async function signTransactionWith2FA(payload) {
    try {
        const response = await signWallet(payload)
        return response
    } catch (e) {
        if (ErrorMatcher.is2FA(e)) {
            const deferred = new Deferred()
            const store = storeFromContext()
            store.dispatch('ui/openModal', {
                component: 'lx-confirm-2fa-modal',
                props: {
                    confirm: async (key) => {
                        try {
                            const response = await signWallet({ ...payload,
                                key
                            })
                            deferred.resolve(response)
                            store.commit('ui/confirmed2FA')
                        } catch (e) {
                            deferred.reject(e)
                        }
                    },
                    cancel: () => {
                        deferred.reject(e)
                    },
                }
            })
            return deferred.promise
        }
    }
}