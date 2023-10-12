import LoadablePageModel from '@/models-ts/LoadablePageModel'
import LoadableModel from '@/models-ts/LoadableModel'
import GigListItem, { GigListItemServerProps } from '@/models-ts/gigs/GigListItem'
import Gig from '@/models/backend/Gig'
import { Commit } from 'vuex'
import { IBrowseGigsState } from './types'
import { getGigsList, getService } from '@/api/gig'

const getInitialState = (): IBrowseGigsState => ({
  details: new LoadableModel(),
  gigs: new LoadablePageModel<GigListItemServerProps>(),
  gigsBySkill: new LoadablePageModel<GigListItemServerProps>(),
  skill: '',
  prefetched: false,
})

export default () => {
  return ({
    namespaced: true,
    state: getInitialState(),
    getters: {
      gigDetails: (state: IBrowseGigsState) => state.details.value && Gig.fromServer(state.details.value),
      gigs: (state: IBrowseGigsState) => state.gigs.values ? state.gigs.values.map(GigListItem.fromServer) : [],
      gigsBySkill: (state: IBrowseGigsState) => state.gigsBySkill.values ? state.gigsBySkill.values.map(GigListItem.fromServer) : [],
    },
    mutations: {
      resetState (state: IBrowseGigsState) {
        Object.assign(state, getInitialState())
      },
      beforeReady (state: IBrowseGigsState) {
        state.details = new LoadableModel(state.details)
        state.gigs = new LoadablePageModel<GigListItemServerProps>(state.gigs)
        state.gigsBySkill = new LoadablePageModel<GigListItemServerProps>(state.gigsBySkill)
      },
      clearDetails (state: IBrowseGigsState) {
        state.details = new LoadableModel()
      },
      setGigsLoading (state: IBrowseGigsState) {
        state.gigs.loading()
      },
      setGigsLoaded (state: IBrowseGigsState, data: any) {
        state.gigs.loaded(data)
      },
      setPrefetched (state: IBrowseGigsState, flag: boolean) {
        state.prefetched = flag
      },
      setDetailsLoading (state: IBrowseGigsState) {
        state.details.loading()
      },
      setDetailsLoaded (state: IBrowseGigsState, details: any) {
        state.details.loaded(details)
      },
      addGigsLoaded (state: IBrowseGigsState, { values, pagination }: { values: any, pagination: any }) {
        state.gigs.loaded({ values: [...state.gigs.values, ...values], pagination })
      },
      setGigsBySkillLoading (state: IBrowseGigsState) {
        state.gigsBySkill.loading()
      },
      setGigsBySkillLoaded (state: IBrowseGigsState, gigs: any) {
        state.gigsBySkill.loaded(gigs)
      },
      addGigsBySkillLoaded (state: IBrowseGigsState, { values, pagination }: { values: any, pagination: any }) {
        state.gigsBySkill.loaded({ values: [...state.gigsBySkill.values, ...values], pagination })
      },
      setSkill (state: IBrowseGigsState, skill: string) {
        state.skill = skill
      },
      setPagination (state: IBrowseGigsState, { limit = 30, offset = 0 }) {
        state.gigs.pagination = {
          ...state.gigs.pagination,
          limit,
          offset,
        }
      },
    },
    actions: {
      async load (
        { commit }: { commit: Commit },
        { id, slug }: { id: number, slug: string }
      ) {
        commit('setDetailsLoading')
        let details
        if (slug) {
          details = await getService(`${slug}-${id}`)
        } else {
          details = await getService(id)
        }
        commit('setDetailsLoaded', details)
      },
      async loadGigs (
        { commit, state }: { commit: Commit, state: IBrowseGigsState },
        { search, sort, direction }: { search: string, sort: string, direction: string }
      ) {
        commit('setGigsLoading')
        const gigs = await getGigsList({
          limit: state.gigs.pagination.limit,
          offset: state.gigs.pagination.offset,
          search,
          order: sort,
          direction,
        })
        commit('setGigsLoaded', { values: gigs.gigs, pagination: gigs.pagination })
      },
      async loadMoreGigs (
        { commit, state }: { commit: Commit, state: IBrowseGigsState },
        { search, sort, direction }: { search: string, sort: string, direction: string }
      ) {
        const gigs = await getGigsList({
          limit: state.gigs.pagination.limit,
          offset: state.gigs.pagination.offset,
          search,
          order: sort,
          direction,
        })
        commit('addGigsLoaded', { values: gigs.gigs, pagination: gigs.pagination })
      },
      async loadGigsBySkill (
        { commit, state }: { commit: Commit, state: IBrowseGigsState },
        {
          search,
          sort,
          direction,
          skills,
          budgetFrom,
          budgetTo,
          payment,
          rating,
        }: {
          search: string,
          sort: string,
          direction: string,
          skills: Array<string>,
          budgetFrom: number,
          budgetTo: number,
          payment: number,
          rating: number,
        }
      ) {
        commit('setGigsBySkillLoading')
        const gigs = await getGigsList({
          skillsIds: skills,
          limit: state.gigs.pagination.limit,
          offset: state.gigs.pagination.offset,
          search,
          order: sort,
          direction,
          budgetFrom,
          budgetTo,
          timeType: payment,
          avgReviews: rating,
        })
        commit('setGigsBySkillLoaded', { values: gigs.gigs, pagination: gigs.pagination })
      },
      async loadMoreGigsBySkill (
        { commit, state }: { commit: Commit, state: IBrowseGigsState },
        {
          search,
          sort,
          direction,
          skills,
          budgetFrom,
          budgetTo,
          payment,
          rating,
        }: {
          search: string,
          sort: string,
          direction: string,
          skills: Array<string>,
          budgetFrom: number,
          budgetTo: number,
          payment: number,
          rating: number,
        }
      ) {
        const gigs = await getGigsList({
          skillsIds: skills,
          limit: state.gigs.pagination.limit,
          offset: state.gigs.pagination.offset,
          search,
          order: sort,
          direction,
          budgetFrom,
          budgetTo,
          timeType: payment,
          avgReviews: rating,
        })
        commit('addGigsBySkillLoaded', { values: gigs.gigs, pagination: gigs.pagination })
      }
    },
  })
}
