import LoadablePageModel from '@/models-ts/LoadablePageModel'
import OfferListItem from '@/models/lists/OfferListItem'
import ApplicationListItem from '@/models/lists/ApplicationListItem'
import OfferCompletedListItem from '@/models/lists/OfferCompletedListItem'
import {
  getWorkerNegotiationsList,
  getWorkerArchivedList,
  getWorkerActiveList,
  getWorkerCompletedList,
  getMyCustomerJobList,
  getMyCustomerCompletedJobList,
} from '@/api/jobs/lists'
import { IMyJobsState } from './types'
import { Module } from 'vuex'
import { RootState } from '@/store'
import { STAGE_IN_PROGRESS, STAGE_STARTED } from '@/constants/jobStages'
import { STAGE_NEW, STAGE_BLOCKED_BY_FREELANCER } from '@/constants-ts/job/jobStages'
import MyCustomerJobListItem from '@/models-ts/job/MyCustomerJobListItem'

const getInitialState = (): IMyJobsState => ({
  clientPosted: new LoadablePageModel(),
  clientActive: new LoadablePageModel(),
  clientCompleted: new LoadablePageModel(),
  clientAll: new LoadablePageModel(),
  workerAll: {
    active: [],
    archived: [],
    completed: [],
    negotiations: [],
    isLoaded: false,
    isLoading: false,
  },
  workerNegotiations: new LoadablePageModel(),
  workerArchived: new LoadablePageModel(),
  workerActive: new LoadablePageModel(),
  workerCompleted: new LoadablePageModel(),
})

const ALL_LIMIT = 1000

export default (): Module<IMyJobsState, RootState> => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getInitialState())
    },
    setClientPostedLoading (state) {
      state.clientPosted.loading()
    },
    setClientPostedLoaded (state, data) {
      state.clientPosted.loaded(data)
    },
    addClientPostedLoaded (state, data) {
      state.clientPosted.loadMore(data)
    },
    changePostedStatus (state, { jobId, status }) {
      const jobIndex = state.clientPosted.values.findIndex(job => job.id === jobId)
      if (jobIndex !== -1) {
        const jobs = state.clientPosted.values.slice(0)
        jobs[jobIndex].status = status
        state.clientPosted.loaded({
          pagination: state.clientPosted.pagination,
          values: [...jobs],
        })
      }
    },
    changeAllStatus (state, { jobId, status }) {
      const job = state.clientAll.values.find(job => job.id === jobId)
      if (job) {
        job.status = status
      }
    },
    setClientActiveLoading (state) {
      state.clientActive.loading()
    },
    setClientActiveLoaded (state, data) {
      state.clientActive.loaded(data)
    },
    addClientActiveLoaded (state, data) {
      state.clientActive.loadMore(data)
    },
    setClientCompletedLoading (state) {
      state.clientCompleted.loading()
    },
    setClientCompletedLoaded (state, data) {
      state.clientCompleted.loaded(data)
    },
    addClientCompletedLoaded (state, data) {
      state.clientCompleted.loadMore(data)
    },
    setClientAllLoading (state) {
      state.clientAll.loading()
    },
    setClientAllLoaded (state, data) {
      state.clientAll.loaded(data)
    },
    addClientAllLoaded (state, data) {
      state.clientAll.loadMore(data)
    },
    setWorkerAllLoading (state) {
      state.workerAll = {
        ...state.workerAll,
        isLoading: true
      }
    },
    setWorkerAllLoaded (state, { active, archived, completed, negotiations }) {
      state.workerAll = {
        active,
        archived,
        completed,
        negotiations,
        isLoading: false,
        isLoaded: true,
      }
    },
    setWorkerNegotiationsLoading (state) {
      state.workerNegotiations.loading()
    },
    setWorkerNegotiationsLoaded (state, data) {
      state.workerNegotiations.loaded(data)
    },
    addWorkerNegotiationsLoaded (state, data) {
      state.workerNegotiations.loadMore(data)
    },
    setWorkerArchivedLoading (state) {
      state.workerArchived.loading()
    },
    setWorkerArchivedLoaded (state, data) {
      state.workerArchived.loaded(data)
    },
    addWorkerArchivedLoaded (state, data) {
      state.workerArchived.loadMore(data)
    },
    setWorkerActiveLoading (state) {
      state.workerActive.loading()
    },
    setWorkerActiveLoaded (state, data) {
      state.workerActive.loaded(data)
    },
    addWorkerActiveLoaded (state, data) {
      state.workerActive.loadMore(data)
    },
    setWorkerCompletedLoading (state) {
      state.workerCompleted.loading()
    },
    setWorkerCompletedLoaded (state, data) {
      state.workerCompleted.loaded(data)
    },
    addWorkerCompletedLoaded (state, data) {
      state.workerCompleted.loadMore(data)
    }
  },
  actions: {
    async loadClientPosted ({ commit }, { limit = 10, offset = 0 }) {
      commit('setClientPostedLoading')
      const { pagination, jobs } = await getMyCustomerJobList({ limit, offset, stages: [STAGE_NEW, STAGE_STARTED] })
      commit('setClientPostedLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadMoreClientPosted ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, jobs } = await getMyCustomerJobList({ limit, offset, stages: [STAGE_NEW, STAGE_STARTED] })
      commit('addClientPostedLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadClientActive ({ commit }, { limit = 10, offset = 0 }) {
      commit('setClientActiveLoading')
      const { pagination, jobs } = await getMyCustomerJobList({
        limit,
        offset,
        stages: [STAGE_IN_PROGRESS, STAGE_BLOCKED_BY_FREELANCER],
      })
      commit('setClientActiveLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadMoreClientActive ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, jobs } = await getMyCustomerJobList({
        limit,
        offset,
        stages: [STAGE_IN_PROGRESS, STAGE_BLOCKED_BY_FREELANCER],
      })
      commit('addClientActiveLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadClientCompleted ({ commit }, { limit = 10, offset = 0 }) {
      commit('setClientCompletedLoading')
      const { pagination, jobs } = await getMyCustomerCompletedJobList({ limit, offset })
      commit('setClientCompletedLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadMoreClientCompleted ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, jobs } = await getMyCustomerCompletedJobList({ limit, offset })
      commit('addClientCompletedLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadClientAll ({ commit }, { limit = 10, offset = 0 }) {
      commit('setClientAllLoading')
      const { pagination, jobs } = await getMyCustomerJobList({ limit, offset })
      commit('setClientAllLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadMoreClientAll ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, jobs } = await getMyCustomerJobList({ limit, offset })
      commit('addClientAllLoaded', { pagination, values: jobs.map(MyCustomerJobListItem.fromServer) })
    },
    async loadWorkerAll ({ commit }) {
      commit('setWorkerAllLoading')
      const [
        { offers: active },
        { offers: completed },
        { applications: archived },
        { applications: negotiations }
      ] = await Promise.all([
        getWorkerActiveList(ALL_LIMIT, 0),
        getWorkerCompletedList(ALL_LIMIT, 0),
        getWorkerArchivedList(ALL_LIMIT, 0),
        getWorkerNegotiationsList(ALL_LIMIT, 0),
      ])
      commit('setWorkerAllLoaded', {
        active: active.map(OfferListItem.fromServer),
        completed: completed.map(OfferCompletedListItem.fromServer),
        archived: archived.map((app: any) => ApplicationListItem.fromServer({ ...app, isArchived: true })),
        negotiations: negotiations.map(ApplicationListItem.fromServer),
      })
    },
    async loadWorkerNegotiations ({ commit }, { limit = 10, offset = 0 }) {
      commit('setWorkerNegotiationsLoading')
      const { pagination, applications } = await getWorkerNegotiationsList(limit, offset)
      commit('setWorkerNegotiationsLoaded', { pagination, values: applications.map(ApplicationListItem.fromServer) })
    },
    async loadMoreWorkerNegotiations ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, applications } = await getWorkerNegotiationsList(limit, offset)
      commit('addWorkerNegotiationsLoaded', { pagination, values: applications.map(ApplicationListItem.fromServer) })
    },
    async loadWorkerArchived ({ commit }, { limit = 10, offset = 0 }) {
      commit('setWorkerArchivedLoading')
      const { pagination, applications } = await getWorkerArchivedList(limit, offset)
      commit('setWorkerArchivedLoaded', {
        pagination,
        values: applications.map((app: any) => ApplicationListItem.fromServer({ ...app, isArchived: true }))
      })
    },
    async loadMoreWorkerArchived ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, applications } = await getWorkerArchivedList(limit, offset)
      commit('addWorkerArchivedLoaded', {
        pagination,
        values: applications.map((app: any) => ApplicationListItem.fromServer({ ...app, isArchived: true }))
      })
    },
    async loadWorkerActive ({ commit }, { limit = 10, offset = 0 }) {
      commit('setWorkerActiveLoading')
      const { pagination, offers } = await getWorkerActiveList(limit, offset)
      commit('setWorkerActiveLoaded', { pagination, values: offers.map(OfferListItem.fromServer) })
    },
    async loadMoreWorkerActive ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, offers } = await getWorkerActiveList(limit, offset)
      commit('addWorkerActiveLoaded', { pagination, values: offers.map(OfferListItem.fromServer) })
    },
    async loadWorkerCompleted ({ commit }, { limit = 10, offset = 0 }) {
      commit('setWorkerCompletedLoading')
      const { pagination, offers } = await getWorkerCompletedList(limit, offset)
      commit('setWorkerCompletedLoaded', { pagination, values: offers.map(OfferCompletedListItem.fromServer) })
    },
    async loadMoreWorkerCompleted ({ commit }, { limit = 10, offset = 0 }) {
      const { pagination, offers } = await getWorkerCompletedList(limit, offset)
      commit('addWorkerCompletedLoaded', { pagination, values: offers.map(OfferCompletedListItem.fromServer) })
    },
  }
})
