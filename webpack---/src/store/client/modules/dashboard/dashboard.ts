import { Commit } from 'vuex'
import LoadableModel from '@/models-ts/LoadableModel'
import DashboardProfileInfo from '@/models-ts/dashboard/DashboardProfileInfo'
import { getProfileInfo } from '@/api/dashboard'
import { getWorkerNegotiationsList, getRecommendedJobs, getMyCustomerJobList } from '@/api/jobs/lists'
import {
  getFreelancerNegotiationsOffers,
  getOffersAsCustomer as getGigOffersAsCustomer,
  getOffersAsFreelancer as getGigOffersAsFreelancer,
  getRecommendedGigs as getRecommendedGigsList,
} from '@/api/gig'
import { FreelancerOffers, IDashboardState, InProgressJob } from './types'
import OfferListItem from '@/models/lists/OfferListItem'
import ApplicationListItem from '@/models/lists/ApplicationListItem'
import MyGigApplication from '@/models-ts/gigs/MyGigApplication'
import JobListItem from '@/models-ts/job/JobListItem'
import { isBefore } from '@/utils/date'
import GigListItem from '@/models-ts/gigs/GigListItem'
import { GigJobStages } from '@/constants-ts/gig/gigJobStages'
import { getOffersAsFreelancer as getJobOffersAsFreelancer } from '@/api/jobs/offers'
import GigOfferListItem from '@/models/lists/GigOfferListItem'
import {
  STAGE_BLOCKED_BY_FREELANCER,
  STAGE_COMPLETED,
  STAGE_DEADLINE_OVERDUE,
  STAGE_DISPUTED,
  STAGE_IN_PROGRESS,
  STAGE_NEW,
  STAGE_STARTED
} from '@/constants-ts/job/jobStages'
import OfferCompletedListItem from '@/models/lists/OfferCompletedListItem'
import MyVacancyListItem from '@/models-ts/vacancies/MyVacancyListItem'
import { getMyFreelancerApplications, getMyPostedVacancies } from '@/api/vacancies'
import VacancyApplication from '@/models-ts/vacancies/VacancyApplication'
import { VacancyApplicationStatuses } from '@/constants-ts/vacancies/vacancyApplicationStatuses'
import MyCustomerJobListItem from '@/models-ts/job/MyCustomerJobListItem'

const getInitialState = (): IDashboardState => ({
  profileInfo: new LoadableModel({ isLoading: false, value: {} }),
  customerInProgress: new LoadableModel(),
  customerPosted: new LoadableModel(),
  customerVacancies: new LoadableModel(),
  freelancerInProgress: new LoadableModel(),
  freelancerOffers: new LoadableModel(),
  freelancerVacancies: new LoadableModel(),
  recommendedJobs: new LoadableModel({ value: [] }),
  recommendedGigs: new LoadableModel({ value: [] }),
})

const getInProgressJobs = async (forFreelancer: boolean) => {
  const getJobs = async () => {
    const getJobsApi = forFreelancer ? getJobOffersAsFreelancer : getMyCustomerJobList
    const { offers } = await getJobsApi({
      limit: 3,
      offset: 0,
      stages: [STAGE_IN_PROGRESS, STAGE_COMPLETED, STAGE_DEADLINE_OVERDUE, STAGE_BLOCKED_BY_FREELANCER, STAGE_DISPUTED],
    })
    return offers.map((offer: any) => [STAGE_IN_PROGRESS, STAGE_BLOCKED_BY_FREELANCER].includes(offer.relations.Job.stage)
      ? OfferListItem.fromServer(offer)
      : OfferCompletedListItem.fromServer(offer))
  }
  const getGigs = async () => {
    const getGigsApi = forFreelancer ? getGigOffersAsFreelancer : getGigOffersAsCustomer
    const { offers } = await getGigsApi({ limit: 3, offset: 0, stages: [GigJobStages.IN_PROGRESS, GigJobStages.BLOCKED] })
    return offers.map(GigOfferListItem.fromServer)
  }
  const [jobs, gigs] = await Promise.all([getJobs(), getGigs()])
  const result = [...jobs, ...gigs]
  result.sort((a, b) => {
    // @ts-ignore
    const getDate = (obj: GigOfferListItem | OfferListItem) => obj instanceof GigOfferListItem ? obj.job.created_at! : obj.inProgressAt
    const aDate = getDate(a)
    const bDate = getDate(b)
    return isBefore(aDate, bDate) ? 1 : -1
  })
  return result.slice(0, 3)
}

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state: IDashboardState) {
      Object.assign(state, getInitialState())
    },
    setProfileInfoLoading (state: IDashboardState) {
      state.profileInfo.loading()
    },
    rejectProfileInfoLoading (state: IDashboardState) {
      state.profileInfo.reject()
    },
    setProfileInfoLoaded (state: IDashboardState, data: DashboardProfileInfo) {
      state.profileInfo.loaded(data)
    },
    setCustomerInProgressLoaded (state: IDashboardState, data: Array<InProgressJob>) {
      state.customerInProgress.loaded(data)
    },
    setCustomerInProgressLoading (state: IDashboardState) {
      state.customerInProgress.loading()
    },
    setCustomerPostedLoaded (state: IDashboardState, data: Array<MyCustomerJobListItem>) {
      state.customerPosted.loaded(data)
    },
    setCustomerPostedLoading (state: IDashboardState) {
      state.customerPosted.loading()
    },
    setCustomerVacanciesLoaded (state: IDashboardState, data: Array<MyVacancyListItem>) {
      state.customerVacancies.loaded(data)
    },
    setCustomerVacanciesLoading (state: IDashboardState) {
      state.customerVacancies.loading()
    },
    setFreelancerInProgressLoaded (state: IDashboardState, data: Array<InProgressJob>) {
      state.freelancerInProgress.loaded(data)
    },
    setFreelancerInProgressLoading (state: IDashboardState) {
      state.freelancerInProgress.loading()
    },
    setFreelancerOffersLoaded (state: IDashboardState, data: Array<FreelancerOffers>) {
      state.freelancerOffers.loaded(data)
    },
    setFreelancerOffersLoading (state: IDashboardState) {
      state.freelancerOffers.loading()
    },
    setFreelancerVacanciesLoaded (state: IDashboardState, data: Array<VacancyApplication>) {
      state.freelancerVacancies.loaded(data)
    },
    setFreelancerVacanciesLoading (state: IDashboardState) {
      state.freelancerVacancies.loading()
    },
    setRecommendedJobsLoaded (state: IDashboardState, data: Array<JobListItem>) {
      state.recommendedJobs.loaded(data)
    },
    setRecommendedJobsLoading (state: IDashboardState) {
      state.recommendedJobs.loading()
    },
    setRecommendedGigsLoaded (state: IDashboardState, data: Array<GigListItem>) {
      state.recommendedGigs.loaded(data)
    },
    setRecommendedGigsLoading (state: IDashboardState) {
      state.recommendedGigs.loading()
    },
  },
  actions: {
    async getProfileInfo ({ commit, state }: { commit: Commit, state: IDashboardState }) {
      if (!state.profileInfo.isLoading) {
        try {
          commit('setProfileInfoLoading')
          const data = await getProfileInfo()
          commit('setProfileInfoLoaded', DashboardProfileInfo.fromServer(data))
        } catch (e) {
          console.error(e)
          commit('rejectProfileInfoLoading')
          throw e
        }
      }
    },
    async getCustomerInProgressJobs ({ commit }: { commit: Commit }) {
      commit('setCustomerInProgressLoading')
      const { jobs } = await getMyCustomerJobList({
        limit: 3,
        offset: 0,
        stages: [STAGE_IN_PROGRESS, STAGE_BLOCKED_BY_FREELANCER],
      })
      commit('setCustomerInProgressLoaded', jobs.map(MyCustomerJobListItem.fromServer))
    },
    async getCustomerPostedJobs ({ commit }: { commit: Commit }) {
      commit('setCustomerPostedLoading')
      const { jobs } = await getMyCustomerJobList({ limit: 3, offset: 0, stages: [STAGE_NEW, STAGE_STARTED] })
      commit('setCustomerPostedLoaded', jobs.map(MyCustomerJobListItem.fromServer))
    },
    async getCustomerVacancies ({ commit }: { commit: Commit }) {
      commit('setCustomerVacanciesLoading')
      const { vacancies } = await getMyPostedVacancies(3, 0)
      commit('setCustomerVacanciesLoaded', vacancies.map(MyVacancyListItem.fromServer))
    },
    async getFreelancerInProgressJobs ({ commit }: { commit: Commit }) {
      commit('setFreelancerInProgressLoading')
      const jobs = await getInProgressJobs(true)
      commit('setFreelancerInProgressLoaded', jobs)
    },
    async getFreelancerOffers ({ commit }: { commit: Commit }) {
      commit('setFreelancerOffersLoading')
      const getJobOffers = async () => {
        const { applications } = await getWorkerNegotiationsList(3, 0)
        return applications.map(ApplicationListItem.fromServer)
      }
      const getGigOffers = async () => {
        const { applications } = await getFreelancerNegotiationsOffers(3, 0)
        return applications.map(MyGigApplication.fromServer)
      }
      const [jobs, gigs] = await Promise.all([getJobOffers(), getGigOffers()])
      const offers = [...jobs, ...gigs].sort((a, b) => isBefore(a.createdAt, b.createdAt) ? 1 : -1).slice(0, 3)
      commit('setFreelancerOffersLoaded', offers)
    },
    async getFreelancerVacancies ({ commit }: { commit: Commit }) {
      commit('setFreelancerVacanciesLoading')
      const { applications } = await getMyFreelancerApplications({
        limit: 3,
        offset: 0,
        statuses: [VacancyApplicationStatuses.NEW, VacancyApplicationStatuses.IN_PROGRESS]
      })
      commit('setFreelancerVacanciesLoaded', applications.map(VacancyApplication.fromServer))
    },
    async getRecommendedJobs ({ commit }: { commit: Commit }) {
      commit('setRecommendedJobsLoading')
      const { jobs } = await getRecommendedJobs({ limit: 2, offset: 0 })
      const mappedList = jobs.map(JobListItem.fromServer)
      commit('setRecommendedJobsLoaded', mappedList)
    },
    async getRecommendedGigs ({ commit }: { commit: Commit }) {
      commit('setRecommendedGigsLoading')
      const { gigs } = await getRecommendedGigsList({ limit: 2, offset: 0 })
      const mappedList = gigs.map(GigListItem.fromServer)
      commit('setRecommendedGigsLoaded', mappedList)
    },
  }
})
