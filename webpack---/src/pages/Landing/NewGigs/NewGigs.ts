import Vue from 'vue'
import throttle from 'lodash/throttle'
import { mapState, mapGetters } from 'vuex'
import LandingGig from '@/models-ts/landing/LandingGig'
import Skill from '@/models-ts/Skill'
import { SERVICES, SERVICE_DETAILS, SERVICE_ADD, FREELANCER_PROFILE, SERVICE_BY_SKILL } from '@/constants-ts/routes'
import { TIME_HOURLY } from '@/constants/backend/service'
import { formatCurrency, withCommas } from '@/utils/moneyFormat'
import LandingMobileStepper from '../LandingMobileStepper/LandingMobileStepper.vue'

export default Vue.extend<any, any, any, any>({
  components: {
    LandingMobileStepper
  },
  data () {
    return {
      SERVICES,
      SERVICE_ADD,
      SERVICE_DETAILS,
      FREELANCER_PROFILE,
      stepIndent: 0,
    }
  },
  computed: {
    ...mapState('landing', {
      gigsCount: (state: any) => state.gigsCount,
    }),
    ...mapGetters({
      gigs: 'landing/gigListPublic',
    }),
    totalFormatted () {
      return withCommas(String(this.gigsCount))
    },
  },
  mounted () {
    this.onScroll()
    window.addEventListener('resize', this.onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onScroll)
  },
  methods: {
    formatRating (rating: number) {
      return Math.round(rating)
    },
    formatBudget (gig: LandingGig) {
      const budget = formatCurrency(gig.rate, { currency: 'USDT', minDecimal: 0, maxDecimal: 0 })
      return gig.time_type === TIME_HOURLY ? `${budget}/hr` : `${budget}`
    },
    getSkillTags (gig: LandingGig) {
      return gig.skills
        .map((skill: Skill) => ({
          text: skill.name,
          ...(!skill.is_custom && skill.url && { link: { name: SERVICE_BY_SKILL, params: { skill: skill.url } } })
        }))
    },
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const gigsContainer = this.$el.querySelector('.gigs-container')
      if (gigsContainer) {
        if (slide === 1) {
          gigsContainer.scrollTo({ left: gigsContainer.scrollWidth, behavior })
        } else {
          gigsContainer.scrollTo({ left: 0, behavior })
        }
      }
    },
    onScroll: throttle(function (this: any) {
      const gigsContainer = this.$el.querySelector('.gigs-container')
      if (gigsContainer) {
        this.stepIndent = (gigsContainer.scrollLeft / (gigsContainer.clientWidth + 20)) * 40
      }
    }, 30),
  },
})
