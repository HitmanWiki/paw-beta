import { getVacancies } from '@/api/vacancies'
import LoadablePageModel from '@/models-ts/LoadablePageModel'
import VacancyListItem, { VacancyListItemFromServer } from '@/models-ts/vacancies/VacancyListItem'
import { Commit } from 'vuex'
import { IBrowseVacanciesState } from './types'

const getInitialState = (): IBrowseVacanciesState => ({
  vacancies: new LoadablePageModel<VacancyListItemFromServer>(),
  prefetched: false,
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  getters: {
    vacancies: (state: IBrowseVacanciesState) => (state.vacancies.values && state.vacancies.values.map(VacancyListItem.fromServer)) || [],
  },
  mutations: {
    resetState (state: IBrowseVacanciesState) {
      Object.assign(state, getInitialState())
    },
    beforeReady (state: IBrowseVacanciesState) {
      state.vacancies = new LoadablePageModel<VacancyListItemFromServer>(state.vacancies)
    },
    setLoading (state: IBrowseVacanciesState) {
      state.vacancies.loading()
    },
    setLoaded (state: IBrowseVacanciesState, data: any) {
      state.vacancies.loaded(data)
    },
    setPrefetched (state: IBrowseVacanciesState, flag: boolean) {
      state.prefetched = flag
    },
    addVacanciesLoaded (state: IBrowseVacanciesState, { values, pagination }: { values: any, pagination: any }) {
      state.vacancies.loaded({ values: [...state.vacancies.values, ...values], pagination })
    },
    setPagination (state: IBrowseVacanciesState, { limit = 30, offset = 0 }) {
      state.vacancies.pagination = {
        ...state.vacancies.pagination,
        limit,
        offset,
      }
    },
    addBookmark (state: IBrowseVacanciesState, { id, vacancy_id }: any) {
      const vacancy = (state.vacancies.values || []).find(vacancy => +vacancy.id === +vacancy_id)
      if (vacancy) {
        vacancy.bookmarks = [{ id }]
      }
    },
    removeBookmark (state: IBrowseVacanciesState, { vacancyId }: any) {
      const vacancy = (state.vacancies.values || []).find(vacancy => +vacancy.id === +vacancyId)
      if (vacancy) {
        vacancy.bookmarks = []
      }
    }
  },
  actions: {
    async loadVacancies (
      { commit, state }: { commit: Commit, state: IBrowseVacanciesState },
      { ...filter } = {}
    ) {
      try {
        commit('setLoading')
        const { pagination, vacancies } = await getVacancies({
          ...filter,
          limit: state.vacancies.pagination.limit,
          offset: state.vacancies.pagination.offset,
        })
        commit('setLoaded', { pagination, values: vacancies })
      } catch (e) {
        console.error(e)
        commit('setLoaded', state.vacancies)
        throw e
      }
    },
    async loadMoreVacancies (
      { commit, state }: { commit: Commit, state: IBrowseVacanciesState },
      { ...filter } = {}
    ) {
      const { pagination, vacancies } = await getVacancies({
        ...filter,
        limit: state.vacancies.pagination.limit,
        offset: state.vacancies.pagination.offset,
      })
      commit('addVacanciesLoaded', { pagination, values: vacancies })
    },
  }
})
