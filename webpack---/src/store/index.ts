// import createPlugin from 'logrocket-vuex'
// import LogRocket from 'logrocket'
import Vue from 'vue'
import Vuex, { Module, Plugin } from 'vuex'
import * as modulesShared from './shared'
import { IMyJobsState } from './client/modules/my-jobs/types'
import { IBlogState } from './shared/modules/blog/types'
import { IBrowseJobsState } from './shared/modules/browse-jobs/types'
import { IBrowseVacanciesState } from './shared/modules/browse-vacancies/types'
import { ICustomerDetailsState } from './shared/modules/customer-details/types'
import { IBrowseFreelancersState } from './shared/modules/browse-freelancers/types'
import { IFreelancersState } from './shared/modules/freelancer-details/types'
import { IBrowseGigsState } from './shared/modules/gigs/types'
import { IJobDetailsState } from './shared/modules/job-details/types'
import { ILandingState } from './shared/modules/landing/types'
import { ILandingCopyState } from './shared/modules/landing-copy/types'
import { IVacancyDetailsState } from './shared/modules/vacancy-details/types'
import { IVacancyRolesState } from './shared/modules/vacancyRoles/types'
import { IBalancesState } from './client/modules/balances/types'
import { IBookmarksState } from './client/modules/bookmarks/types'
import { IChatNewState } from './client/modules/chat-new/types'
import { IDashboardState } from './client/modules/dashboard/types'
import { IServicesListState } from './client/modules/gig/types'
import { IMyGigsState } from './client/modules/my-gigs/types'
import { IMyVacanciesState } from './client/modules/my-vacancies/types'
import { IPendingTxsState } from './client/modules/pending-txs/types'
import { ISignState } from './client/modules/sign-process/types'
import { IUiState } from './client/modules/ui/types'
import { ISnacksState } from './client/modules/snacks/types'
import { ISignupState } from './client/modules/signup/types'
import { ISkillsState } from './shared/modules/skills/types'

Vue.use(Vuex)

function storeModuleFactoryCreate (factoryModule: {[key: string]: () => Module<any, RootState>}) {
  return Object.entries(factoryModule)
    .map(([key, factory]) => ({ key, value: factory() }))
    .reduce((t, entry) => ({ ...t, [entry.key]: entry.value }), {})
}

export default function () {
  const plugins: Plugin<RootState>[] = []
  // if (process.client && process.env.VUE_APP_MODE === 'prod') {
  //   plugins.push(createPlugin(LogRocket))
  // }

  const store = new Vuex.Store<RootState>(
    {
      strict: process.env.NODE_ENV === 'development' && (process.client || typeof process.client === 'undefined'),
      modules: {
        ...storeModuleFactoryCreate(modulesShared),
      },
      actions: {
        resetState ({ commit }) {
          const RESET_COMMIT = 'resetState'
          const RESETTABLE_MODULES = [
            'browseJobs',
            'browseVacancies',
            'jobDetails',
            'myJobs',
            'user',
            'balances',
            'freelancerDetails',
            'notifications',
            'chat',
            'dashboard',
            'myVacancies',
            'vacancyDetails',
            'chatNew',
            'myGigs',
            'bookmarks',
            'customerDetails',
          ]
          RESETTABLE_MODULES.forEach(module => {
            try {
              commit(`${module}/${RESET_COMMIT}`)
            } catch (e) {
              console.error(e)
            }
          })
        }
      },
      plugins
    },
  )
  return store
}

export interface RootState {
  // client
  balances: IBalancesState
  bookmarks: IBookmarksState
  chatNew: IChatNewState
  dashboard: IDashboardState
  gig: IServicesListState
  myGigs: IMyGigsState
  myJobs: IMyJobsState
  myVacancies: IMyVacanciesState
  pendingTxs: IPendingTxsState
  signProcess: ISignState
  snacks: ISnacksState
  ui: IUiState

  // shared
  blog: IBlogState
  browseJobs: IBrowseJobsState
  browseGigs: IBrowseGigsState
  browseVacancies: IBrowseVacanciesState
  browseFreelancers: IBrowseFreelancersState
  customerDetails: ICustomerDetailsState
  freelancerDetails: IFreelancersState
  jobDetails: IJobDetailsState
  landing: ILandingState
  landingCopy: ILandingCopyState
  skills: ISkillsState
  vacancyDetails: IVacancyDetailsState
  vacancyRoles: IVacancyRolesState
  signup: ISignupState
  [key: string]: any // ToDo: get rid of it, exactly describe
}
