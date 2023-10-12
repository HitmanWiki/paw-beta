import Vue from 'vue'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { mapActions, mapState, mapGetters } from 'vuex'
import { BROWSE_JOBS, POST_A_JOB, VACANCIES } from '@/constants-ts/routes'
import { withCommas } from '@/utils/moneyFormat'
import LandingMobileStepper from '../LandingMobileStepper/LandingMobileStepper.vue'
import JobCard from './JobCard/JobCard.vue'
import VacancyCard from './VacancyCard/VacancyCard.vue'

export default Vue.extend<any, any, any, any>({
  components: {
    JobCard,
    VacancyCard,
    LandingMobileStepper,
  },
  data () {
    return {
      BROWSE_JOBS,
      POST_A_JOB,
      VACANCIES,
      activeView: 0,
      stepIndent: 0,
    }
  },
  computed: {
    ...mapState('app', {
      isLoggedIn: (state: any) => state.authorized,
    }),
    ...mapState('landing', {
      jobsCount: (state: any) => state.jobsCount,
      vacanciesCount: (state: any) => state.vacanciesCount,
    }),
    ...mapGetters({
      jobs: 'landing/jobListPublic',
      vacancies: 'landing/vacancyListPublic',
    }),
    totalJobsFormatted () {
      return withCommas(String(this.jobsCount))
    },
    totalVacanciesFormatted () {
      return withCommas(String(this.vacanciesCount))
    },
    activeViewSelector () {
      return this.activeView === 0 ? '.jobs-container' : '.vacancies-container'
    },
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
    }),
    alignJobCard (behavior?: 'smooth' | 'auto') {
      const jobsContainer = this.$el.querySelector(this.activeViewSelector)
      if (jobsContainer) {
        if (jobsContainer.scrollLeft > jobsContainer.clientWidth / 2 + 10) {
          this.scrollTo(1, behavior)
        } else {
          this.scrollTo(0, behavior)
        }
      }
    },
    alignView (behavior?: 'smooth' | 'auto') {
      const viewContainer = this.$el.querySelector('.slide-jobs-container')
      if (viewContainer) {
        if (viewContainer.scrollLeft > viewContainer.clientWidth / 2 + 10) {
          this.scrollToView(1, behavior)
        } else {
          this.scrollToView(0, behavior)
        }
      }
    },
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const jobsContainer = this.$el.querySelector(this.activeViewSelector)
      if (jobsContainer) {
        if (slide === 1) {
          jobsContainer.scrollTo({ left: jobsContainer.scrollWidth, behavior })
        } else {
          jobsContainer.scrollTo({ left: 0, behavior })
        }
      }
    },
    scrollToView (view: number, behavior?: 'smooth' | 'auto') {
      const viewContainer = this.$el.querySelector('.slide-jobs-container')
      if (viewContainer) {
        if (view === 1) {
          viewContainer.scrollTo({ left: viewContainer.scrollWidth, behavior })
          this.activeView = 1
        } else {
          viewContainer.scrollTo({ left: 0, behavior })
          this.activeView = 0
        }
        this.stepIndent = 0
        this.scrollTo(0)
      }
    },
    onResize: debounce(function (this: any) {
      this.scrollToView(this.activeView, 'auto')
      this.alignJobCard('auto')
    }, 30),
    onScroll: throttle(function (this: any) {
      const jobsContainer = this.$el.querySelector(this.activeViewSelector)
      if (jobsContainer) {
        this.stepIndent = (jobsContainer.scrollLeft / (jobsContainer.clientWidth + 20)) * 40
      }
    }, 30),
    onViewScroll: debounce(function (this: any) { this.alignView('smooth') }, 30),
  },
})
