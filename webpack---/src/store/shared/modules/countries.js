import LoadableModel from '@/models/LoadableModel'
import {
    getCountries
} from '@/api/country'

const getInitialState = () => ({
    list: new LoadableModel(Object),
})

export default () => ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
        resetState(state) {
            Object.assign(state, getInitialState())
        },
        beforeReady(state) {
            state.list = new LoadableModel(Object, state.list)
        },
        setListLoading(state) {
            state.list.loading()
        },
        setListLoaded(state, data) {
            state.list.loaded(data)
        },
    },
    actions: {
        async getCountries({
            state,
            commit
        }) {
            if (state.list.isLoaded) {
                return state.list.value
            }
            commit('setListLoading')
            const list = await getCountries()
            commit('setListLoaded', list)
            return list
        },
    }
})