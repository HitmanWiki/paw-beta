import Vue from 'vue'
import throttle from 'lodash/throttle'
import { VACANCY_ADD, FREELANCERS_LIST } from '@/constants-ts/routes'
import LandingMobileStepper from '../LandingMobileStepper/LandingMobileStepper.vue'

export default Vue.extend({
  components: {
    LandingMobileStepper
  },
  data () {
    return {
      VACANCY_ADD,
      FREELANCERS_LIST,
      stepIndent: 0,
    }
  },
  mounted () {
    this.onScroll()
    window.addEventListener('resize', this.onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onScroll)
  },
  methods: {
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const pointsContainer = this.$el.querySelector('.section-points')
      if (pointsContainer) {
        const pointCard = pointsContainer.querySelector('.point')
        if (pointCard) {
          pointsContainer.scrollTo({ left: pointCard.clientWidth * slide + (slide * 20), behavior })
        }
      }
    },
    onScroll: throttle(function (this: any) {
      const pointsContainer = this.$el.querySelector('.section-points')
      if (pointsContainer) {
        const pointCard = pointsContainer.querySelector('.point')
        if (pointCard) {
          const width = (pointCard.clientWidth + 20)
          this.stepIndent = 0
          if (pointsContainer.scrollLeft >= width / 3 && pointsContainer.scrollLeft < (width + width / 3)) {
            this.stepIndent = 44.4
          } else if (pointsContainer.scrollLeft >= (width + width / 3)) {
            this.stepIndent = 88.8
          }
        }
      }
    }, 30),
  }
})
