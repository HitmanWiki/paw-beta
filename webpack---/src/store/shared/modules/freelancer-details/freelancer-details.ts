import Vue from 'vue'
import { Commit, Module } from 'vuex'
import LoadableModel from '@/models-ts/LoadableModel'
import { IFreelancersState } from './types'
import { FREELANCER_PROFILE } from '@/constants-ts/routes'
import FreelancerDetails, { FreelancerDetailsServerProps } from '@/models-ts/user/details/FreelancerDetails'
import { getWorker } from '@/api/usersAndProfiles/profiles'

const getInitialState = (): IFreelancersState => ({
  prefetched: false,
  details: {},
})

const freelancerDetails = (): Module<IFreelancersState, any> => ({
  namespaced: true,
  state: getInitialState(),
  getters: {
    id: (state, getters, rootState) => rootState.route.name === FREELANCER_PROFILE && rootState.route.params.id,
    freelancer: (state, getters) => state.details[getters.id]?.value && FreelancerDetails.fromServer(state.details[getters.id]?.value),
    isLoaded: (state, getters) => state.details[getters.id]?.isLoaded,
    isLoading: (state, getters) => state.details[getters.id] ? state.details[getters.id].isLoading : true,
  },
  mutations: {
    resetState (state) {
      Object.assign(state, getInitialState())
    },
    setPrefetched (state, flag) {
      state.prefetched = flag
    },
    beforeReady (state) {
      Object.entries(state.details).forEach(([id, model]) => {
        state.details[id] = new LoadableModel(model)
      })
    },
    clearFreelancer (state: IFreelancersState) {
      state.details = {}
    },
    setFreelancerLoading (state: IFreelancersState, id: number) {
      if (!state.details[id]) {
        Vue.set(state.details, id, new LoadableModel())
      }
      state.details[id].loading()
    },
    setFreelancerLoaded (state: IFreelancersState, { id, user }: { id: string, user: FreelancerDetailsServerProps }) {
      if (state.details[id]) {
        state.details[id].loaded(user)
      }
    },
  },
  actions: {
    async load ({ commit, state }: { commit: Commit, state: IFreelancersState }, id: number) {
      if (!state.details[id]?.isLoaded) {
        commit('setFreelancerLoading', id)
        const user = await getWorker(id)
        commit('setFreelancerLoaded', { id, user })
      }
    }
  },
})

export default freelancerDetails
