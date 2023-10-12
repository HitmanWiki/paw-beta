import Vue from 'vue'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { mapActions, mapState } from 'vuex'
import WheelIndicator from '@/plugins/wheelIndicator'
import isElementInViewport from '@/utils-ts/isElementInViewport'
import { DASHBOARD } from '@/constants-ts/routes'

const SLIDE_GAP = 24
export default Vue.extend<any, any, any, any>({
  data () {
    return {
      active: 'commissions',
      activeStep: 0,
      steps: ['commissions', 'reputation', 'payments', 'contract'],
      changing: false,
      wheelDirection: '',
      scrollUpCount: 0,
      allowScrollUp: false,
      scrollDownCount: 0,
      allowScrollDown: false,
    }
  },
  computed: {
    ...mapState('app', {
      isLoggedIn: (state: any) => state.authorized,
    }),
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    const indicator = new WheelIndicator({
      elem: this.$refs.benefits,
      callback: this.onWheel,
      preventMouse: this.onPreventMouseWheel,
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
    }),
    onPreventMouseWheel (e: any) {
      if (this.xsAndDown || !isElementInViewport(this.$refs.benefits)) {
        return false
      }
      if (e.direction) {
        this.wheelDirection = e.direction
      }
      if (e.direction === 'up') {
        if (this.activeStep === 0) {
          this.scrollUpCount += 1
          if (this.scrollUpCount > 1) {
            this.allowScrollUp = true
          }
        } else {
          this.scrollUpCount = 0
          this.allowScrollUp = false
        }
        this.scrollDownCount = 0
        this.allowScrollDown = false
        return this.activeStep > 0 || this.changing
      }
      if (e.direction === 'down') {
        if (this.activeStep === 3) {
          this.scrollDownCount += 1
          if (this.scrollDownCount > 1) {
            this.allowScrollDown = true
          }
        } else {
          this.scrollDownCount = 0
          this.allowScrollDown = false
        }
        this.scrollUpCount = 0
        this.allowScrollUp = false
        return this.activeStep < this.steps.length - 1 || this.changing
      }
      if (!e.direction) {
        return this.changing ||
        (this.wheelDirection === 'down' && (this.activeStep < 3 || !this.allowScrollDown)) ||
        (this.wheelDirection === 'up' && (this.activeStep > 0 || !this.allowScrollUp))
      }
    },
    alignBenefit (behavior?: 'smooth' | 'auto') {
      const benefitsContainer = this.$el.querySelector('.benefits')
      if (benefitsContainer) {
        const benefitCard = benefitsContainer.querySelector('.benefit')
        const cardScrolled = Math.floor(benefitsContainer.scrollLeft / benefitCard.clientWidth)
        const toCard = (benefitsContainer.scrollLeft - cardScrolled * benefitCard.clientWidth) > benefitCard.clientWidth / 2 + 10
          ? cardScrolled + 1
          : cardScrolled
        this.scrollTo(toCard, behavior)
      }
    },
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const benefitsContainer = this.$el.querySelector('.benefits')
      if (benefitsContainer) {
        const benefitCard = benefitsContainer.querySelector('.benefit')
        if (benefitCard) {
          benefitsContainer.scrollTo({ left: (benefitCard.clientWidth + SLIDE_GAP) * slide, behavior })
        }
      }
    },
    onResize: debounce(function (this: any) { this.alignBenefit('auto') }, 30),
    onScroll: throttle(function (this: any) {
      const benefits = this.$refs.benefits
      const active = Math.floor(benefits.scrollLeft / (benefits.clientWidth + SLIDE_GAP))
      const scrollLeft = benefits.scrollLeft
      const stepWidth = benefits.clientWidth
      const visiblePartActive = Math.max(3 - (scrollLeft - (stepWidth + SLIDE_GAP) * active) / stepWidth * 2, 1)
      const steps = [...this.$refs.steps.children]
      steps.forEach((step: any, i: number) => {
        if (i === active) {
          step.style.flexGrow = visiblePartActive
          const activeColor = 1 - Math.min((3 - visiblePartActive) / 5, 1)
          step.style.backgroundColor = `rgba(255,255,255, ${activeColor})`
        } else if (i === active + 1) {
          step.style.flexGrow = 4 - visiblePartActive
          const activeColor = 1 - Math.min((visiblePartActive - 1) / 5, 1)
          step.style.backgroundColor = `rgba(255,255,255, ${Math.max(activeColor, 0.6)})`
        } else {
          step.style.flexGrow = 1
          step.style.backgroundColor = `rgba(255,255,255, 0.6)`
        }
      })
    }, 30),
    onRegisterClick () {
      if (this.isLoggedIn) {
        this.$router.push({ name: DASHBOARD })
      } else {
        this.openModal({
          component: 'lx-sign-up-modal'
        })
      }
    },
    onStepClick (step: string) {
      this.$el.style = `height: ${this.$el.clientHeight}px`
      this.active = step
      this.activeStep = this.steps.findIndex((step: string) => step === this.active)
      setTimeout(() => { this.$el.style = '' }, 300)
    },
    onWheel (e: any) {
      if (!this.xsAndDown) {
        if (isElementInViewport(this.$refs.benefits)) {
          if (e.direction === 'up') {
            if (this.activeStep > 0) {
              this.changeStep(this.activeStep - 1)
            }
          } else {
            if (this.activeStep < this.steps.length - 1) {
              this.changeStep(this.activeStep + 1)
            }
          }
        }
      }
    },
    changeStep (step: number) {
      if (!this.changing) {
        this.changing = true
        this.onStepClick(this.steps[step])
        setTimeout(() => {
          this.changing = false
        }, 300)
      }
    },
  },
})
