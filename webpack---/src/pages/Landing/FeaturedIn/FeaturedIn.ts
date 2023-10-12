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
      articles: [
        {
          source: 'Nasdaq',
          logoBlack: '/static/images/landing/featured-in/nasdaq-b.png',
          logoWhite: '/static/images/landing/featured-in/nasdaq-w.png',
          class: 'nasdaq',
          title: 'Chrono.tech (TIME) Crypto Takes Off After a Sizable Fundraise From Mark Carnegie',
          // eslint-disable-next-line max-len
          text: 'There are new crypto investors are paying attention to today. Chrono.tech (CCC:TIME-USD) is seeing the spotlight after closing out a lucrative fundraise.',
          url: 'https://www.nasdaq.com/articles/chrono.tech-time-crypto-takes-off-after-a-sizable-fundraise-from-mark-carnegie',
        },
        {
          source: 'HACKERNOON',
          logoBlack: '/static/images/landing/featured-in/hackernoon-b.png',
          logoWhite: '/static/images/landing/featured-in/hackernoon-w.png',
          logo: '/static/images/landing/featured-in/hackernoon.png',
          class: 'hackernoon',
          title: 'Blockchain transforming HR from the backend',
          // eslint-disable-next-line max-len
          text: 'When Bitcoin exploded into the scene, the technology that came with it was quickly adopted by numerous industries as a way to manage information securely, transparently, and above all, transparently, something that Human resource departments are in desperate need of: a method of managing talent and people, from communication to getting paid on time.',
          url: 'https://hackernoon.com/blockchain-transforming-hr-from-the-backend',
        },
        {
          source: 'Tech-Times',
          logoBlack: '/static/images/landing/featured-in/tech-times-b.png',
          logoWhite: '/static/images/landing/featured-in/tech-times-w.png',
          class: 'tech-times',
          title: 'How CGU and Chrono.tech Provide An End-To-End Solution For Gamers',
          // eslint-disable-next-line max-len
          text: `Crypto Gaming United (CGU) fits neatly into Chrono.tech's suite of blockchain-based products and services, with both sides bringing network effect, liquidity, utility and users to the other. There are some comments from the team.`,
          url: 'https://www.techtimes.com/articles/268208/20211118/how-cgu-and-chrono-tech-provide-an-end-to-end-solution-for-gamers.htm',
        },
      ]
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
    alignPostCard (behavior?: 'smooth' | 'auto') {
      const postsContainer = this.$el.querySelector('.posts-container')
      if (postsContainer) {
        const postCard = postsContainer.querySelector('.post')
        const cardScrolled = Math.floor(postsContainer.scrollLeft / postCard.clientWidth)
        const toCard = (postsContainer.scrollLeft - cardScrolled * postCard.clientWidth) > postCard.clientWidth / 2 + 10
          ? cardScrolled + 1
          : cardScrolled
        this.scrollTo(toCard, behavior)
      }
    },
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const postsContainer = this.$el.querySelector('.posts-container')
      if (postsContainer) {
        const postCard = postsContainer.querySelector('.post')
        if (postCard) {
          postsContainer.scrollTo({ left: postCard.clientWidth * slide + (slide * 20), behavior })
        }
      }
    },
    onScroll: throttle(function (this: any) {
      const postsContainer = this.$el.querySelector('.posts-container')
      if (postsContainer) {
        const postCard = postsContainer.querySelector('.post')
        this.stepIndent = (postsContainer.scrollLeft / (postCard.clientWidth + 20)) * 44
      }
    }, 30),
  }
})
