// import LogRocket from 'logrocket'
import Cookies from 'js-cookie'
import Deferred from 'promise-deferred'
import LoadableModel from '@/models/LoadableModel'
import Cancel2FAError from '@/errors/Cancel2FAError'
import Config from '@/models-ts/backend/Config'
import CommonProfile from '@/models/user/CommonProfile'
import ErrorMatcher from '@/utils/ErrorMatcher'
import logRocket from '@/servicies-ts/LogRocket'
import lxAnalytics from '@/servicies-ts/analytics/LxAnalytics'
import {
    ActiveProfile,
    Avatar,
    CompanyProfile,
    EmployerProfile,
    Reputation,
    WorkerProfile,
    Wallet
} from '@/models/user'
import {
    changePassword,
    changeEmailRequest,
    confirmEmail,
    enable2FA,
    disable2FA,
    getActiveRole,
    getUserInfo,
    switchRole,
    uploadAvatar,
    removeAvatar,
    deleteUser,
} from '@/api/users'
import {
    setDefaultWallet,
    removeWallet,
    createWallet,
    renameWallet
} from '@/api/wallets'
import {
    SnackTypes
} from '@/constants-ts/SnackTypes'
import {
    Roles,
    USER_TYPE_CUSTOMER_COMPANY
} from '@/constants-ts/user/roles'
import {
    USER_TYPE_CUSTOMER_PERSON
} from '@/constants/user'
import {
    USER_ACCOUNT_SIMPLE
} from '@/constants/accountTypes'
import {
    getMeRating
} from '@/api/rating'
import {
    getName
} from '@/utils/profile'
import {
    Blockchain
} from '@/constants-ts/blockchain'

function parseJwt(token) {
    var base64Url = token.split('.')[1]
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
};

const getInitialState = () => ({
    accessToken: null,
    contest: null,
    referrerId: null,
    utm: {},
    id: null,
    createdAt: '',
    roleChanging: false,
    active2FA: false,
    isSocialAuth: false,
    isCrypto: false,
    isOutsideCustomer: false,
    email: null,
    avatar: null,
    companyLogo: null,
    activeRole: null,
    profile: new LoadableModel(ActiveProfile),
    wallet: null,
    walletTron: null,
    configs: [],
    wallets: [],
    walletDefaultLoading: null,
    walletRemoveLoading: null,
    walletAddLoading: false,
    customerIsNewbie: false,
    // @deprecated
    rating: new LoadableModel(Reputation),
    hasSkills: false, // ToDo: save skill data
    hasGigs: false,
    type: USER_ACCOUNT_SIMPLE,
    premiumByBlatu: false,
    premiumExpiredAt: null,
    blockchain: Blockchain.Ethereum,
    profiles: {
        [Roles.CUSTOMER]: false,
        [Roles.FREELANCER]: false,
    },
    customerType: 0,
    countCompletedJobs: 0,
    countPaidJobs: 0,
})

export default () => {
    return ({
        namespaced: true,
        state: getInitialState(),
        getters: {
            tokenInfo: state => state.accessToken ? parseJwt(state.accessToken) : null,
            name: state => getName(state.profile ? .value) || state.email,
            getMyCustomProfile: (state) => {
                if (!state.profile ? .value) return null
                return CommonProfile.fromServer({
                    id: state.id,
                    profile: state.profile ? .value,
                    avatar: state.avatar,
                    type: state.type
                })
            },
            getConfigMap: state => state.configs.reduce((accum, item) => ({ ...accum,
                [item.name]: item.value
            }), {}),
            activeProfile: state => {
                if (state.accessToken) {
                    try {
                        const jwtData = parseJwt(state.accessToken)
                        return jwtData.active_profile || null
                    } catch (e) {
                        console.error('Error token parse')
                        return null
                    }
                }
                return null
            },
        },
        mutations: {
            resetState(state) {
                Object.assign(state, getInitialState())
            },
            setReferrerId(state, referrerId) {
                state.referrerId = referrerId
            },
            setUtmMetrics(state, utm = {}) {
                state.utm = {
                    ...state.utm,
                    utm_source: utm.utm_source,
                    utm_medium: utm.utm_medium,
                    utm_campaign: utm.utm_campaign,
                    utm_content: utm.utm_content,
                    utm_term: utm.utm_term,
                }
            },
            setGeneralInfo(state, info) {
                Object.assign(state, info)
            },
            setCustomerIsNewbie(state, customerIsNewbie) {
                state.customerIsNewbie = customerIsNewbie
            },
            setAvatar(state, avatar) {
                state.avatar = avatar
            },
            setCompanyLogo(state, avatar) {
                state.companyLogo = avatar
            },
            setActiveRole(state, role) {
                state.activeRole = role
            },
            setProfileLoading(state) {
                state.profile.loading()
            },
            setProfileLoaded(state, profile) {
                state.profile.loaded(profile)
            },
            setProfileData(state, data) {
                if (state.profile.value) {
                    Object.assign(state.profile.value, data)
                }
            },
            setProfiles(state, profiles) {
                state.profiles[Roles.CUSTOMER] = profiles.has_customer_account || false
                state.profiles[Roles.FREELANCER] = profiles.has_freelancer_account || false
            },
            setConfigs: (state, configs) => {
                state.configs = configs
            },
            setWallet: (state, wallet) => {
                state.wallet = wallet
            },
            setWallets: (state, wallets) => {
                state.wallets = wallets
            },
            setRatingLoading: (state) => {
                state.rating.loading()
            },
            setRatingLoaded: (state, rating) => {
                state.rating.loaded(rating)
            },
            setSkills: (state, flag) => {
                state.hasSkills = flag
            },
            setGigs: (state, flag) => {
                state.hasGigs = flag
            },
            setRoleChanging: (state, flag) => {
                state.roleChanging = flag
            },
            setToken: (state, token) => {
                state.accessToken = token
            },
            setCountCompletedJobs: (state, countCompletedJobs) => {
                state.countCompletedJobs = countCompletedJobs
            },
            setCountPaidJobs: (state, countPaidJobs) => {
                state.countPaidJobs = countPaidJobs
            },
            setBlockchain: (state, blockchain) => {
                state.blockchain = blockchain
            },
            setWalletDefaultLoading: (state, address) => {
                state.walletDefaultLoading = address
            },
            setWalletRemoveLoading: (state, address) => {
                state.walletRemoveLoading = address
            },
            setWalletAddLoading: (state, flag) => {
                state.walletAddLoading = flag
            },
            setContest(state, contest) {
                state.contest = contest
            },
        },
        actions: {
            setActiveProfile({
                state,
                commit
            }, userInfo) {
                const profile = userInfo.profile
                const userRole = state.activeRole
                if (userRole === Roles.FREELANCER) {
                    commit('setProfileLoaded', WorkerProfile.fromServer({
                        ...profile,
                        reviews_count: userInfo.relations.Freelancer ? .reviews_count || 0,
                    }))
                } else if (profile.type === USER_TYPE_CUSTOMER_PERSON) {
                    commit('setProfileLoaded', EmployerProfile.fromServer(profile))
                } else {
                    commit('setProfileLoaded', CompanyProfile.fromServer(profile))
                }
            },
            async updateRating({
                state,
                commit
            }, rating) {
                if (state.profile.isLoading) return
                commit('setRatingLoading')
                if (!rating) {
                    try {
                        const res = await getMeRating()
                        commit('setRatingLoaded', Reputation.fromServer(res))
                    } catch (err) {
                        console.error(err)
                    }
                } else {
                    commit('setRatingLoaded', Reputation.fromServer(rating))
                }
            },
            async getActiveRole({
                commit
            }) {
                const {
                    active_profile
                } = await getActiveRole()
                commit('setActiveRole', active_profile)
            },
            async getUserInfo({
                commit,
                dispatch,
                state
            }) {
                commit('setProfileLoading')
                commit('setRatingLoading')
                const userInfo = await getUserInfo()
                Cookies.set('lxAccount', userInfo.id, {
                    expires: 36500,
                    samesite: 'lax',
                })
                commit('setActiveRole', userInfo.active_profile)
                commit('setGeneralInfo', {
                    id: userInfo.id,
                    email: userInfo.email,
                    wallet: userInfo.wallet,
                    active2FA: userInfo.google_2fa === 1,
                    isSocialAuth: userInfo.is_social,
                    isCrypto: !!userInfo.is_crypto,
                    isOutsideCustomer: !!userInfo.is_outside_customer,
                    type: userInfo.type,
                    premiumByBlatu: userInfo.type_by === 2,
                    premiumExpiredAt: userInfo.meta ? .premiumExpiredAt,
                    createdAt: userInfo.created_at,
                    customerType: userInfo.profile.type,
                })
                commit('setCountCompletedJobs', userInfo.meta ? .countCompletedJobs)
                commit('setCountPaidJobs', userInfo.meta ? .countPaidJobs)
                commit('notifications/setUnreadedCount', userInfo.meta ? .unReadNotifications, {
                    root: true
                })
                commit('setCustomerIsNewbie', userInfo.meta ? .customerIsNewbie)
                commit('bookmarks/setBookmarks', userInfo.bookmarks, {
                    root: true
                })
                logRocket.init(userInfo.id)
                commit('setProfiles', userInfo.profiles)
                commit('setWallet', userInfo.wallet)
                commit('setAvatar', Avatar.fromServer(userInfo.avatar))
                commit('setWallets', (userInfo.wallets || []).map(wallet => Wallet.fromServer(wallet)))
                // const rates = userInfo.rates || []
                // commit('app/setRates', rates, { root: true })
                commit('setConfigs', userInfo.config.map(item => new Config(item)))
                commit('setSkills', !!userInfo.skills ? .length)
                commit('setGigs', !!userInfo.gigs ? .count)
                if (userInfo.profile.CompanyLogo) {
                    commit('setCompanyLogo', Avatar.fromServer(userInfo.profile.CompanyLogo))
                }
                await dispatch('setActiveProfile', userInfo)
                await dispatch('updateRating', userInfo.rating)
                dispatch('balances/loadBalances', null, {
                    root: true
                })
                // if (process.client && process.env.VUE_APP_MODE === 'prod') {
                //   LogRocket.identify(userInfo.id.toString(), {
                //     name: state.profile.value.name,
                //     email: userInfo.email,
                //     role: userInfo.active_profile === USER_TYPE_FREELANCER ? 'freelancer' : 'customer',
                //   })
                // }
                lxAnalytics.sendGAData(state.accessToken)
            },
            async switchRole({
                state,
                commit,
                dispatch
            }, role) {
                try {
                    commit('setRoleChanging', true)
                    commit('setProfileLoading')
                    try {
                        const {
                            token
                        } = await switchRole(role)
                        await dispatch('app/setToken', token, {
                            root: true
                        })
                        commit('setActiveRole', role)
                    } catch (e) {
                        console.error(e)
                        commit('setProfileLoaded', state.profile.value)
                        throw e
                    }
                    // dispatch('notifications/reloadNotifications', null, { root: true })
                    dispatch('getUserInfo')
                } finally {
                    commit('setRoleChanging', false)
                }
            },
            async updateAvatar({
                commit
            }, data) {
                const avatar = await uploadAvatar(data)
                commit('setAvatar', Avatar.fromServer(avatar))
            },
            async removeAvatar({
                commit
            }, data) {
                await removeAvatar(data)
                commit('setAvatar', null)
            },
            async enable2FA({
                commit
            }, {
                key,
                secret
            }) {
                const response = await enable2FA(key, secret)
                commit('setGeneralInfo', {
                    active2FA: true
                })
                return response
            },
            async disable2FA({
                commit
            }, key) {
                await disable2FA(key)
                commit('setGeneralInfo', {
                    active2FA: false
                })
            },
            async changePassword({
                dispatch
            }, {
                oldPassword,
                newPassword,
                key
            }) {
                const {
                    token
                } = await changePassword({
                    oldPassword,
                    newPassword,
                    key
                })
                dispatch('app/setToken', token, {
                    root: true
                })
            },
            async changeEmail(context, {
                email,
                key
            }) {
                return changeEmailRequest({
                    email,
                    key
                })
            },
            async confirmEmail({
                dispatch
            }, confirmationToken) {
                const {
                    token
                } = await confirmEmail(confirmationToken)
                return dispatch('app/setToken', token, {
                    root: true
                })
            },
            async deleteAccount({
                dispatch
            }, payload) {
                await deleteUser(payload)
                dispatch('app/setToken', null, {
                    root: true
                })
                dispatch('resetState', null, {
                    root: true
                })
            },
            async setDefaultWallet({
                commit,
                dispatch
            }, wallet) {
                try {
                    commit('setWalletDefaultLoading', wallet.address)
                    await setDefaultWallet(wallet.address)
                    const userInfo = await getUserInfo()
                    commit('setWallet', userInfo.wallet)
                    commit('setWallets', (userInfo.wallets || []).map(wallet => Wallet.fromServer(wallet)))
                    dispatch('balances/loadBalances', null, {
                        root: true
                    })
                } finally {
                    commit('setWalletDefaultLoading', null)
                }
            },
            async removeWallet({
                commit,
                dispatch
            }, wallet) {
                try {
                    commit('setWalletRemoveLoading', wallet.address)
                    const deferred = new Deferred()
                    try {
                        await removeWallet({
                            address: wallet.address
                        })
                        deferred.resolve()
                    } catch (err) {
                        if (ErrorMatcher.is2FA(err)) {
                            dispatch('ui/openModal', {
                                component: 'lx-confirm-2fa-modal',
                                props: {
                                    confirm: async (key) => {
                                        try {
                                            await removeWallet({
                                                address: wallet.address,
                                                key
                                            })
                                            commit('ui/confirmed2FA', null, {
                                                root: true
                                            })
                                            deferred.resolve()
                                        } catch (e) {
                                            deferred.reject(e)
                                        }
                                    },
                                    cancel: () => deferred.reject(new Cancel2FAError()),
                                }
                            }, {
                                root: true
                            })
                        } else {
                            throw err
                        }
                    }
                    await deferred.promise
                    const userInfo = await getUserInfo()
                    commit('setWallet', userInfo.wallet)
                    commit('setWallets', (userInfo.wallets || []).map(wallet => Wallet.fromServer(wallet)))
                } catch (err) {
                    // ToDo: move to component
                    const text = err ? .response ? .data ? .validation ? .wallet || 'Error remove wallet'
                    dispatch('snacks/openSnackbar', {
                        type: SnackTypes.FAILURE,
                        title: 'Error',
                        text,
                    }, {
                        root: true
                    })
                } finally {
                    commit('setWalletRemoveLoading', null)
                }
            },
            async addWallet({
                commit
            }, wallet) {
                try {
                    commit('setWalletAddLoading', true)
                    await createWallet(wallet)
                    const userInfo = await getUserInfo()
                    commit('setWallets', (userInfo.wallets || []).map(wallet => Wallet.fromServer(wallet)))
                } finally {
                    commit('setWalletAddLoading', false)
                }
            },
            async renameWallet({
                commit
            }, payload) {
                await renameWallet(payload)
                const userInfo = await getUserInfo()
                commit('setWallets', (userInfo.wallets || []).map(wallet => Wallet.fromServer(wallet)))
            }
        },
    })
}