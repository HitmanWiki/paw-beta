import { Commit } from 'vuex'
import LandingGig, { LandingGigFromServer } from '@/models-ts/landing/LandingGig'
import LandingJob, { LandingJobFromServer } from '@/models-ts/landing/LandingJob'
import LandingVacancy, { LandingVacancyFromServer } from '@/models-ts/landing/LandingVacancy'
import { getLandingCopyData } from '@/api/landing'
import { ILandingCopyState } from './types'

const getInitialState = (): ILandingCopyState => ({
  jobListPublicData: [],
  gigListPublicData: [],
  vacanycyListPublicData: [],
  jobsCount: 0,
  gigsCount: 0,
  vacanciesCount: 0,
})

export default () => {
  return {
    namespaced: true,
    state: getInitialState(),
    getters: {
      jobListPublic: (state: ILandingCopyState) => state.jobListPublicData.map(LandingJob.fromServer),
      gigListPublic: (state: ILandingCopyState) => state.gigListPublicData.map(LandingGig.fromServer),
      vacancyListPublic: (state: ILandingCopyState) => state.vacanycyListPublicData.map(LandingVacancy.fromServer),
    },
    mutations: {
      setJobListPublicData (
        state: ILandingCopyState,
        { items, total }: { items: Array<LandingJobFromServer>, total: number }
      ) {
        state.jobListPublicData = items
        state.jobsCount = total
      },
      setGigListPublicData (
        state: ILandingCopyState,
        { items, total }: { items: Array<LandingGigFromServer>, total: number }
      ) {
        state.gigListPublicData = items
        state.gigsCount = total
      },
      setVacancyListPublicData (
        state: ILandingCopyState,
        { items, total }: { items: Array<LandingVacancyFromServer>, total: number }
      ) {
        state.vacanycyListPublicData = items
        state.vacanciesCount = total
      },
    },
    actions: {
      async getLandingData ({ commit }: { commit: Commit }) {
        try {
          const result = await getLandingCopyData()
          commit('setJobListPublicData', result.jobs)
          commit('setGigListPublicData', result.gigs)
          commit('setVacancyListPublicData', result.vacancies)
          commit('blog/setLastPostsData', result.blog, { root: true })
        } catch (e) {
          console.log('Error fetching landing data', e)
          commit('setJobListPublicData', { items: [], total: 0 })
          commit('setGigListPublicData', { items: [], total: 0 })
          commit('setVacancyListPublicData', { items: [], total: 0 })
          commit('blog/setLastPostsData', [], { root: true })
        }
      },
    },
  }
}
