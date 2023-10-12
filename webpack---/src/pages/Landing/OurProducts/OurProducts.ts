import Vue from 'vue'
import throttle from 'lodash/throttle'
import LandingMobileStepper from '../LandingMobileStepper/LandingMobileStepper.vue'

export default Vue.extend<any, any, any, any>({
  components: {
    LandingMobileStepper
  },
  data () {
    return {
      stepIndent: 0,
      cardScrolled: 0,
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
    alignProject (behavior?: 'smooth' | 'auto') {
      const projectsContainer = this.$el.querySelector('.projects')
      if (projectsContainer) {
        const cardScrolled = Math.floor(projectsContainer.scrollLeft / projectsContainer.clientWidth)
        const maxScrolled = projectsContainer.clientWidth / 2 + 10
        const toCard = (projectsContainer.scrollLeft - cardScrolled * projectsContainer.clientWidth) > maxScrolled
          ? cardScrolled + 1
          : cardScrolled
        this.scrollTo(toCard, behavior)
      }
    },
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const projectsContainer = this.$el.querySelector('.projects')
      if (projectsContainer) {
        projectsContainer.scrollTo({ left: projectsContainer.clientWidth * slide + (slide * 20), behavior })
      }
    },
    onScroll: throttle(function (this: any) {
      const projectsContainer = this.$el.querySelector('.projects')
      if (projectsContainer) {
        this.cardScrolled = Math.floor(projectsContainer.scrollLeft / projectsContainer.clientWidth)
        const projectCard = projectsContainer.querySelector('.project')
        this.stepIndent = (projectsContainer.scrollLeft / (projectCard.clientWidth + 20)) * 45.3
      }
    }, 30),
  }
})
