import { Commit } from 'vuex'
import LoadablePageModel, { LoadablePagePagination } from '@/models-ts/LoadablePageModel'
import MyVacancyListItem from '@/models-ts/vacancies/MyVacancyListItem'
import { IMyVacanciesState } from './types'
import {
  getMyCompletedVacancies,
  getMyDraftsVacancies,
  getMyPostedVacancies,
  publishVacancy,
  unpublishVacancy,
  getMyFreelancerApplications,
} from '@/api/vacancies'
import VacancyApplication from '@/models-ts/vacancies/VacancyApplication'
import { VacancyApplicationStatuses } from '@/constants-ts/vacancies/vacancyApplicationStatuses'

const getInitialState = (): IMyVacanciesState => ({
  posted: new LoadablePageModel<MyVacancyListItem>(),
  drafts: new LoadablePageModel<MyVacancyListItem>(),
  completed: new LoadablePageModel<MyVacancyListItem>(),
  freelancerAll: new LoadablePageModel<VacancyApplication>(),
  freelancerApplied: new LoadablePageModel<VacancyApplication>(),
  freelancerInProgress: new LoadablePageModel<VacancyApplication>(),
  freelancerArchived: new LoadablePageModel<VacancyApplication>(),
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state: IMyVacanciesState) {
      Object.assign(state, getInitialState())
    },
    setPostedLoading (state: IMyVacanciesState) {
      state.posted.loading()
    },
    setPostedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<MyVacancyListItem> }
    ) {
      state.posted.loaded(data)
    },
    addPostedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<MyVacancyListItem> }
    ) {
      state.posted.loadMore(data)
    },
    setDraftsLoading (state: IMyVacanciesState) {
      state.drafts.loading()
    },
    setDraftsLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<MyVacancyListItem> }
    ) {
      state.drafts.loaded(data)
    },
    addDraftsLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<MyVacancyListItem> }
    ) {
      state.drafts.loadMore(data)
    },
    removeFromPublished (state: IMyVacanciesState, id: number) {
      const i = state.posted.values.findIndex(vacancy => vacancy.id === id)
      if (i !== -1) {
        state.posted.pagination.total = Math.max(state.posted.pagination.total - 1, 0)
        state.posted.pagination.offset = Math.max((state.posted.pagination.offset || 1) - 1, 0)
        state.posted.values.splice(i, 1)
      }
    },
    removeFromDrafts (state: IMyVacanciesState, id: number) {
      const i = state.drafts.values.findIndex(vacancy => vacancy.id === id)
      if (i !== -1) {
        state.drafts.pagination.total = Math.max(state.drafts.pagination.total - 1, 0)
        state.drafts.pagination.offset = Math.max((state.drafts.pagination.offset || 1) - 1, 0)
        state.drafts.values.splice(i, 1)
      }
    },
    setCompletedLoading (state: IMyVacanciesState) {
      state.completed.loading()
    },
    setCompletedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<MyVacancyListItem> }
    ) {
      state.completed.loaded(data)
    },
    addCompletedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<MyVacancyListItem> }
    ) {
      state.completed.loadMore(data)
    },
    setFreelancerAllLoading (state: IMyVacanciesState) {
      state.freelancerAll.loading()
    },
    setFreelancerAllLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerAll.loaded(data)
    },
    addFreelancerAllLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerAll.loadMore(data)
    },
    setFreelancerAppliedLoading (state: IMyVacanciesState) {
      state.freelancerApplied.loading()
    },
    setFreelancerAppliedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerApplied.loaded(data)
    },
    addFreelancerAppliedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerApplied.loadMore(data)
    },

    setFreelancerInProgressLoading (state: IMyVacanciesState) {
      state.freelancerInProgress.loading()
    },
    setFreelancerInProgressLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerInProgress.loaded(data)
    },
    addFreelancerInProgressLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerInProgress.loadMore(data)
    },
    setFreelancerArchivedLoading (state: IMyVacanciesState) {
      state.freelancerArchived.loading()
    },
    setFreelancerArchivedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerArchived.loaded(data)
    },
    addFreelancerArchivedLoaded (
      state: IMyVacanciesState,
      data: { pagination: LoadablePagePagination, values: Array<VacancyApplication> }
    ) {
      state.freelancerArchived.loadMore(data)
    },
  },
  actions: {
    async publish ({ commit }: { commit: Commit }, id: number) {
      await publishVacancy(id)
      commit('removeFromDrafts', id)
    },
    async unpublish ({ commit }: { commit: Commit }, id: number) {
      await unpublishVacancy(id)
      commit('removeFromPublished', id)
    },
    async loadPosted ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setPostedLoading')
      const { pagination, vacancies } = await getMyPostedVacancies(limit, offset)
      commit('setPostedLoaded', { pagination, values: vacancies.map(MyVacancyListItem.fromServer) })
    },
    async loadMorePosted ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, vacancies } = await getMyPostedVacancies(limit, offset)
      commit('addPostedLoaded', { pagination, values: vacancies.map(MyVacancyListItem.fromServer) })
    },
    async loadDrafts ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setDraftsLoading')
      const { pagination, vacancies } = await getMyDraftsVacancies(limit, offset)
      commit('setDraftsLoaded', { pagination, values: vacancies.map(MyVacancyListItem.fromServer) })
    },
    async loadMoreDrafts ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, vacancies } = await getMyDraftsVacancies(limit, offset)
      commit('addDraftsLoaded', { pagination, values: vacancies.map(MyVacancyListItem.fromServer) })
    },
    async loadCompleted ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setCompletedLoading')
      const { pagination, vacancies } = await getMyCompletedVacancies(limit, offset)
      commit('setCompletedLoaded', { pagination, values: vacancies.map(MyVacancyListItem.fromServer) })
    },
    async loadMoreCompleted ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, vacancies } = await getMyCompletedVacancies(limit, offset)
      commit('addCompletedLoaded', { pagination, values: vacancies.map(MyVacancyListItem.fromServer) })
    },
    async loadFreelancerAll ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerAllLoading')
      const { pagination, applications } = await getMyFreelancerApplications({ limit, offset })
      commit('setFreelancerAllLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadMoreFreelancerAll ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, applications } = await getMyFreelancerApplications({ limit, offset })
      commit('addFreelancerAllLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadFreelancerApplied ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerAppliedLoading')
      const { pagination, applications } = await getMyFreelancerApplications({ limit, offset, statuses: [VacancyApplicationStatuses.NEW] })
      commit('setFreelancerAppliedLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadMoreFreelancerApplied ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, applications } = await getMyFreelancerApplications({ limit, offset, statuses: [VacancyApplicationStatuses.NEW] })
      commit('addFreelancerAppliedLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadFreelancerInProgress ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerInProgressLoading')
      const { pagination, applications } = await getMyFreelancerApplications({
        limit,
        offset,
        statuses: [VacancyApplicationStatuses.IN_PROGRESS],
      })
      commit('setFreelancerInProgressLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadMoreFreelancerInProgress ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, applications } = await getMyFreelancerApplications({
        limit,
        offset,
        statuses: [VacancyApplicationStatuses.IN_PROGRESS],
      })
      commit('addFreelancerInProgressLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadFreelancerArchived ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      commit('setFreelancerArchivedLoading')
      const { pagination, applications } = await getMyFreelancerApplications({
        limit,
        offset,
        statuses: [VacancyApplicationStatuses.ARCHIVED, VacancyApplicationStatuses.APPLIED]
      })
      commit('setFreelancerArchivedLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
    async loadMoreFreelancerArchived ({ commit }: { commit: Commit }, { limit = 10, offset = 0 }) {
      const { pagination, applications } = await getMyFreelancerApplications({
        limit,
        offset,
        statuses: [VacancyApplicationStatuses.ARCHIVED, VacancyApplicationStatuses.APPLIED]
      })
      commit('addFreelancerArchivedLoaded', { pagination, values: applications.map(VacancyApplication.fromServer) })
    },
  }
})
