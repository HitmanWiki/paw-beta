import LoadablePageModel from '@/models-ts/LoadablePageModel'
import { Commit } from 'vuex'
import { IBrowseJobsState } from './types'
import { BrowseJobsFilter, getPublicJobsList } from '@/api/jobs/lists'
import JobListItem, { JobListItemServerProps } from '@/models-ts/job/JobListItem'

const getInitialState = (): IBrowseJobsState => ({
  jobs: new LoadablePageModel<JobListItemServerProps>(),
  skill: '',
  prefetched: false,
})

export default () => {
  return ({
    namespaced: true,
    state: getInitialState(),
    getters: {
      jobs: (state: IBrowseJobsState) => state.jobs.values ? state.jobs.values.map(JobListItem.fromServer) : [],
    },
    mutations: {
      resetState (state: IBrowseJobsState) {
        Object.assign(state, getInitialState())
      },
      beforeReady (state: IBrowseJobsState) {
        state.jobs = new LoadablePageModel<JobListItemServerProps>(state.jobs)
      },
      setJobsLoading (state: IBrowseJobsState) {
        state.jobs.loading()
      },
      setJobsLoaded (state: IBrowseJobsState, data: any) {
        state.jobs.loaded(data)
      },
      setPrefetched (state: IBrowseJobsState, flag: boolean) {
        state.prefetched = flag
      },
      addJobsLoaded (state: IBrowseJobsState, { values, pagination }: { values: any, pagination: any }) {
        state.jobs.loaded({ values: [...state.jobs.values, ...values], pagination })
      },
      setSkill (state: IBrowseJobsState, skill: string) {
        state.skill = skill
      },
      setPagination (state: IBrowseJobsState, { limit = 30, offset = 0 }) {
        state.jobs.pagination = {
          ...state.jobs.pagination,
          limit,
          offset,
        }
      },
    },
    actions: {
      async loadJobs (
        { commit, state }: { commit: Commit, state: IBrowseJobsState },
        {
          search,
          sort,
          direction,
          skills,
          rateFrom,
          rateTo,
          avgReviews,
        }: {
          search: string,
          sort: BrowseJobsFilter['orderField'],
          direction: BrowseJobsFilter['orderType'],
          skills: Array<string>,
          rateFrom: number,
          rateTo: number,
          avgReviews: number,
        }
      ) {
        commit('setJobsLoading')
        const jobs = await getPublicJobsList({
          limit: state.jobs.pagination.limit,
          offset: state.jobs.pagination.offset,
          skills: skills,
          search,
          orderField: sort,
          orderType: direction,
          rateFrom,
          rateTo,
          avgReviews,
        })
        commit('setJobsLoaded', { values: jobs.jobs, pagination: jobs.pagination })
      },
      async loadMoreJobs (
        { commit, state }: { commit: Commit, state: IBrowseJobsState },
        {
          search,
          sort,
          direction,
          skills,
          rateFrom,
          rateTo,
          avgReviews,
        }: {
          search: string,
          sort: BrowseJobsFilter['orderField'],
          direction: BrowseJobsFilter['orderType'],
          skills: Array<string>,
          rateFrom: number,
          rateTo: number,
          avgReviews: number,
        }
      ) {
        const jobs = await getPublicJobsList({
          skills: skills,
          limit: state.jobs.pagination.limit,
          offset: state.jobs.pagination.offset,
          search,
          orderField: sort,
          orderType: direction,
          rateFrom,
          rateTo,
          avgReviews,
        })
        commit('addJobsLoaded', { values: jobs.jobs, pagination: jobs.pagination })
      }
    },
  })
}
