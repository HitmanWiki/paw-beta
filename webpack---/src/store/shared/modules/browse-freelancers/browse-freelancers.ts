import LoadablePageModel from '@/models-ts/LoadablePageModel'
import { Commit } from 'vuex'
import { IBrowseFreelancersState } from './types'
import { BrowseFreelancersFilter, searchFreelancers } from '@/api/usersAndProfiles/profiles'
import FreelancerListItem, { FreelancerListItemServerProps } from '@/models-ts/user/FreelancerListItem'

const getInitialState = (): IBrowseFreelancersState => ({
  freelancers: new LoadablePageModel<FreelancerListItemServerProps>(),
  skill: '',
  prefetched: false,
})

export default () => {
  return ({
    namespaced: true,
    state: getInitialState(),
    getters: {
      freelancers: (state: IBrowseFreelancersState) => state.freelancers.values
        ? state.freelancers.values.map(FreelancerListItem.fromServer)
        : [],
    },
    mutations: {
      resetState (state: IBrowseFreelancersState) {
        Object.assign(state, getInitialState())
      },
      beforeReady (state: IBrowseFreelancersState) {
        state.freelancers = new LoadablePageModel<FreelancerListItemServerProps>(state.freelancers)
      },
      setFreelancersLoading (state: IBrowseFreelancersState) {
        state.freelancers.loading()
      },
      setFreelancersLoaded (state: IBrowseFreelancersState, data: any) {
        state.freelancers.loaded(data)
      },
      setPrefetched (state: IBrowseFreelancersState, flag: boolean) {
        state.prefetched = flag
      },
      addFreelancersLoaded (state: IBrowseFreelancersState, { values, pagination }: { values: any, pagination: any }) {
        state.freelancers.loaded({ values: [...state.freelancers.values, ...values], pagination })
      },
      setSkill (state: IBrowseFreelancersState, skill: string) {
        state.skill = skill
      },
      setPagination (state: IBrowseFreelancersState, { limit = 30, offset = 0 }) {
        state.freelancers.pagination = {
          ...state.freelancers.pagination,
          limit,
          offset,
        }
      },
    },
    actions: {
      async loadFreelancers (
        { commit, state }: { commit: Commit, state: IBrowseFreelancersState },
        {
          search,
          sort,
          direction,
          skills,
          review,
          rateFrom,
          rateTo,
        }: {
          search: string,
          sort: BrowseFreelancersFilter['orderField'],
          direction: BrowseFreelancersFilter['orderType'],
          skills: Array<string>,
          review: number,
          rateFrom: number,
          rateTo: number,
        }
      ) {
        commit('setFreelancersLoading')
        const freelancers = await searchFreelancers({
          limit: state.freelancers.pagination.limit,
          offset: state.freelancers.pagination.offset,
          skills: skills,
          search,
          orderField: sort,
          orderType: direction,
          review,
          rateFrom,
          rateTo,
        })
        commit('setFreelancersLoaded', { values: freelancers.freelancers, pagination: freelancers.pagination })
      },
      async loadMoreFreelancers (
        { commit, state }: { commit: Commit, state: IBrowseFreelancersState },
        {
          search,
          sort,
          direction,
          skills,
          review,
          rateFrom,
          rateTo,
        }: {
          search: string,
          sort: BrowseFreelancersFilter['orderField'],
          direction: BrowseFreelancersFilter['orderType'],
          skills: Array<string>,
          review: number,
          rateFrom: number,
          rateTo: number,
        }
      ) {
        const freelancers = await searchFreelancers({
          skills: skills,
          limit: state.freelancers.pagination.limit,
          offset: state.freelancers.pagination.offset,
          search,
          orderField: sort,
          orderType: direction,
          review,
          rateFrom,
          rateTo,
        })
        commit('addFreelancersLoaded', { values: freelancers.freelancers, pagination: freelancers.pagination })
      }
    },
  })
}
