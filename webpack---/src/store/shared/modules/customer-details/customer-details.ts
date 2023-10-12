import Vue from 'vue'
import CustomerDetails, { CustomerDetailsFromServerProps } from '@/models-ts/user/details/CustomerDetails'
import LoadableModel from '@/models-ts/LoadableModel'
import { getCustomer } from '@/api/usersAndProfiles/profiles'
import { ICustomerDetailsState } from './types'
import { Commit } from 'vuex'
import { getPublicJobsList } from '@/api/jobs/lists'
import JobListItem, { JobListItemServerProps } from '@/models-ts/job/JobListItem'
import VacancyListItem, { VacancyListItemFromServer } from '@/models-ts/vacancies/VacancyListItem'
import { getVacancies } from '@/api/vacancies'

const getInitialState = (): ICustomerDetailsState => ({
  details: new LoadableModel(),
  jobs: new LoadableModel({ value: [] }),
  vacancies: new LoadableModel({ value: [] }),
  prefetched: false,
})

export default () => {
  return {
    namespaced: true,
    state: getInitialState(),
    getters: {
      customer: (state: ICustomerDetailsState) => state.details.value && CustomerDetails.fromServer(state.details.value),
      isLoading: (state: ICustomerDetailsState) => state.details.isLoading,
      jobs: (state: ICustomerDetailsState) => state.jobs.value ? state.jobs.value.map(JobListItem.fromServer) : [],
      vacancies: (state: ICustomerDetailsState) => (state.vacancies.value && state.vacancies.value.map(VacancyListItem.fromServer)) || [],
    },
    mutations: {
      resetState (state: ICustomerDetailsState) {
        Object.assign(state, getInitialState())
      },
      clearCustomer (state: ICustomerDetailsState) {
        state.details = new LoadableModel()
        state.jobs = new LoadableModel({ value: [] })
        state.vacancies = new LoadableModel({ value: [] })
      },
      beforeReady (state: ICustomerDetailsState) {
        state.details = new LoadableModel(state.details)
        state.jobs = new LoadableModel(state.jobs)
        state.vacancies = new LoadableModel(state.vacancies)
      },
      setPrefetched (state: ICustomerDetailsState, flag: boolean) {
        state.prefetched = flag
      },
      setCustomerLoading (state: ICustomerDetailsState) {
        state.details.loading()
      },
      setCustomerLoaded (state: ICustomerDetailsState, customer: CustomerDetailsFromServerProps) {
        state.details.loaded(customer)
      },
      setJobsLoading (state: ICustomerDetailsState) {
        state.jobs.loading()
      },
      setJobsLoaded (state: ICustomerDetailsState, jobs: Array<JobListItemServerProps>) {
        state.jobs.loaded(jobs)
      },
      setVacanciesLoading (state: ICustomerDetailsState) {
        state.vacancies.loading()
      },
      setVacanciesLoaded (state: ICustomerDetailsState, vacancies: Array<VacancyListItemFromServer>) {
        state.vacancies.loaded(vacancies)
      },
    },
    actions: {
      async load ({ commit }: { commit: Commit }, id: number) {
        commit('setCustomerLoading')
        const customer = await getCustomer(id)
        commit('setCustomerLoaded', customer)
        commit('setJobsLoading')
        const { jobs } = await getPublicJobsList({
          limit: 10,
          offset: 0,
          customerId: id,
        })
        commit('setJobsLoaded', jobs)
        commit('setVacanciesLoading')
        const { vacancies } = await getVacancies({
          limit: 10,
          offset: 0,
          customerId: id,
        })
        commit('setVacanciesLoaded', vacancies)
      }
    },
  }
}
