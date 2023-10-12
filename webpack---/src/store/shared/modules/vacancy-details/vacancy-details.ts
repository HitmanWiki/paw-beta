import Vue from 'vue'
import { Commit, Dispatch, Module } from 'vuex'
import { IVacancyDetailsState } from './types'
import LoadableModel from '@/models-ts/LoadableModel'
import Vacancy from '@/models-ts/vacancies/Vacancy'
import {
  VACANCY_DETAILS,
  VACANCY_DETAILS_BY_ID,
  VACANCY_DETAILS_ADMIN,
  VACANCY_DETAILS_ADMIN_DESCRIPTION,
  VACANCY_DETAILS_ADMIN_APPLICATIONS,
  VACANCY_EXTERNAL_APPLY
} from '@/constants-ts/routes'
import {
  getVacancies,
  getVacancy,
  publishVacancy,
  unpublishVacancy,
  archiveVacancy,
} from '@/api/vacancies'
import { Stages, Statuses } from '@/constants-ts/vacancies/statuses'
import VacancyListItem, { VacancyListItemFromServer } from '@/models-ts/vacancies/VacancyListItem'
import { VacancyApplicationStatuses } from '@/constants-ts/vacancies/vacancyApplicationStatuses'
import { declineApplicationAsCustomer, readApplications } from '@/api/vacancies/applications'

const getInitialState = (): IVacancyDetailsState => ({
  prefetched: false,
  vacancy: new LoadableModel(),
  moreVacancies: new LoadableModel<Array<VacancyListItemFromServer>>({ value: [] }),
})

const vacancyDetails = (): Module<IVacancyDetailsState, any> => ({
  namespaced: true,
  state: getInitialState(),
  getters: {
    vacancyId: (state, getters, rootState) =>
      [
        VACANCY_DETAILS,
        VACANCY_DETAILS_BY_ID,
        VACANCY_DETAILS_ADMIN,
        VACANCY_DETAILS_ADMIN_DESCRIPTION,
        VACANCY_DETAILS_ADMIN_APPLICATIONS,
        VACANCY_EXTERNAL_APPLY
      ].includes(rootState.route.name) && rootState.route.params.id,
    vacancy: (state) => state.vacancy?.value && Vacancy.fromServer(state.vacancy.value),
    moreVacancies: (state: IVacancyDetailsState, getters) =>
      ((state.moreVacancies.value && state.moreVacancies.value.map(VacancyListItem.fromServer)) || [])
        .filter(vacancy => Number(vacancy.id) !== Number(getters.vacancyId))
        .slice(0, 5),
    isLoaded: (state) => state.vacancy.isLoaded,
    isLoading: (state) => state.vacancy.isLoading,
    isOwner: (state, getters, rootState) => getters.isLoaded && getters.vacancy.customer_id === rootState.user?.id,
  },
  mutations: {
    resetState (state) {
      Object.assign(state, getInitialState())
    },
    setPrefetched (state, flag) {
      state.prefetched = flag
    },
    beforeReady (state) {
      state.vacancy = new LoadableModel(state.vacancy)
      state.moreVacancies = new LoadableModel(state.moreVacancies)
    },
    clearVacancy (state) {
      state.vacancy = new LoadableModel()
    },
    clearMoreVacancies (state) {
      state.moreVacancies = new LoadableModel({ value: [] })
    },
    setVacancyLoading (state, id) {
      state.vacancy.loading()
    },
    setVacancyLoaded (state, vacancy) {
      state.vacancy.loaded(vacancy)
    },
    setPublishStatus (state, { id, status }) {
      if (state.vacancy.value?.id === id) {
        state.vacancy.value.status = status
      }
    },
    setStage (state, { id, stage }) {
      if (state.vacancy.value?.id === id) {
        state.vacancy.value.stage = stage
      }
    },
    saveBookmark (state, { id, bookmarkId }) {
      if (state.vacancy.value?.id === id) {
        state.vacancy.value.meta = { ...state.vacancy.value.meta, bookmarks: [{ id: bookmarkId }] }
      }
    },
    removeBookmark (state, id) {
      if (state.vacancy.value?.id === id) {
        state.vacancy.value.meta = { ...state.vacancy.value.meta, bookmarks: [] }
      }
    },
    setApplicationStatus (state: IVacancyDetailsState, { id, appId, status }) {
      if (state.vacancy.value?.id === id) {
        const index = (state.vacancy.value.relations.Application || []).findIndex(app => app.id === appId)
        if (index !== -1) {
          state.vacancy.value.relations.Application![index].status = status
        }
      }
    },
    setMoreVacanciesLoading (state) {
      state.moreVacancies.loading()
    },
    setMoreVacanciesLoaded (state, list) {
      state.moreVacancies.loaded(list)
    },
    setReadApplications (state: IVacancyDetailsState, { vacancyId, ids, flag }: { vacancyId: number, ids: Array<number>, flag: number }) {
      if (state.vacancy.value?.id === vacancyId) {
        (state.vacancy.value.relations.Application || []).forEach(app => {
          if (ids.includes(app.id)) {
            app.is_read = flag
          }
        })
      }
    },
  },
  actions: {
    async load ({ commit }, { slug, id }) {
      commit('setVacancyLoading', id)
      let vacancy
      if (slug) {
        vacancy = await getVacancy(`${slug}-${id}`)
      } else {
        vacancy = await getVacancy(id)
      }
      commit('setVacancyLoaded', vacancy)
    },
    async loadMoreVacancies ({ commit }) {
      commit('setMoreVacanciesLoading')
      const { vacancies } = await getVacancies({
        limit: 6,
        offset: 0,
      })
      commit('setMoreVacanciesLoaded', vacancies)
    },
    async publishVacancy ({ commit }, id) {
      await publishVacancy(id)
      commit('setPublishStatus', { id, status: Statuses.PUBLISHED })
    },
    async unpublishVacancy ({ state, commit }: { state: IVacancyDetailsState, commit: Commit }, id) {
      await unpublishVacancy(id)
      const job = state.vacancy.value
      commit('setPublishStatus', { id, status: Statuses.DRAFT })
      const applications = (job?.relations.Application || [])
      for (const app of applications) {
        commit('setApplicationStatus', { id, appId: app.id, status: VacancyApplicationStatuses.ARCHIVED })
      }
    },
    // async hireApplication ({ state, commit }: { state: IVacancyDetailsState, commit: Commit }, application: VacancyApplicationItem) {
    //   await declineApplicationAsCustomer(application.id)
    //   const job = state.vacancy.value
    //   const otherApplications = (job?.relations.Application || []).filter(app => app.id !== application.id)
    //   for (const app of otherApplications) {
    //     commit('setApplicationStatus', { id: application.vacancyId, appId: app.id, status: VacancyApplicationStatuses.ARCHIVED })
    //   }
    //   commit('setApplicationStatus', { id: application.vacancyId, appId: application.id, status: VacancyApplicationStatuses.ARCHIVED })
    //   commit('setStage', { id: application.vacancyId, stage: Stages.COMPLETED })
    // },
    async declineApplication ({ commit }, application) {
      await declineApplicationAsCustomer(application.id)
      commit('setApplicationStatus', { id: application.vacancyId, appId: application.id, status: VacancyApplicationStatuses.ARCHIVED })
    },
    async readApplications ({ commit }, { vacancyId, ids }) {
      await readApplications(ids)
      commit('setReadApplications', { vacancyId, ids, flag: 1 })
    },
    async archiveVacancy ({ state, commit }: { state: IVacancyDetailsState, commit: Commit }, id) {
      await archiveVacancy(id)
      const job = state.vacancy.value
      commit('setStage', { id: job.id, stage: Stages.ARCHIVED })
      for (const app of job.relations.Application || []) {
        commit('setApplicationStatus', { id: job.id, appId: app.id, status: VacancyApplicationStatuses.ARCHIVED })
      }
    },
  }
})

export default vacancyDetails
