import FreelancerListItem from '@/models/lists/FreelancerListItem'
import LoadablePageModel from '@/models/LoadablePageModel'
// import { BACKEND_CURRENCY_USDT_ID } from '@/constants/currency'
import {
    searchFreelancers
} from '@/api/usersAndProfiles/profiles'

const getInitialState = () => ({
    list: new LoadablePageModel(Object),
    prefetched: false,
})

export default () => {
    return {
        namespaced: true,
        state: getInitialState(),
        mutations: {
            beforeReady(state) {
                state.list = new LoadablePageModel(Object, state.list)
            },
            resetState(state) {
                Object.assign(state, getInitialState())
            },
            setLoading(state) {
                state.list.loading()
            },
            setLoaded(state, data) {
                state.list.loaded(data)
            },
            setPrefetched(state, flag) {
                state.prefetched = flag
            },
        },
        getters: {
            users: state => (state.list.values && state.list.values.map(FreelancerListItem.fromServer)) || [],
        },
        actions: {
            async loadUsers({
                commit,
                state
            }, {
                limit = 10,
                offset = 0,
                ...filter
            } = {}) {
                try {
                    commit('setLoading')
                    const {
                        pagination,
                        profiles
                    } = await searchFreelancers({
                        ...filter,
                        limit,
                        offset,
                    })
                    commit('setLoaded', {
                        pagination,
                        values: profiles
                    })
                    return profiles
                } catch (e) {
                    console.log(e)
                    commit('setLoaded', state.list)
                    throw e
                }
            },
        }
    }
}