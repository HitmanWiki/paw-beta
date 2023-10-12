import Vue from 'vue'
import throttle from 'lodash/throttle'
import { mapGetters } from 'vuex'
import { BLOG, POST } from '@/constants-ts/routes'
import { replaceUploadUrl } from '@/utils/file'
import LandingMobileStepper from '../LandingMobileStepper/LandingMobileStepper.vue'

export default Vue.extend<any, any, any, any>({
  components: {
    LandingMobileStepper
  },
  data () {
    return {
      BLOG,
      POST,
      stepIndent: 0,
    }
  },
  computed: {
    ...mapGetters({
      posts: 'blog/lastPosts',
    }),
  },
  mounted () {
    this.onScroll()
    window.addEventListener('resize', this.onScroll)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onScroll)
  },
  methods: {
    replaceUploadUrl,
    scrollTo (slide: number, behavior?: 'smooth' | 'auto') {
      const postsContainer = this.$el.querySelector('.posts-container')
      if (postsContainer) {
        const postCard = postsContainer.querySelector('.post')
        if (postCard) {
          postsContainer.scrollTo({ left: postsContainer.clientWidth * slide + (slide * 40), behavior })
        }
      }
    },
    onScroll: throttle(function (this: any) {
      const postsContainer = this.$el.querySelector('.posts-container')
      if (postsContainer) {
        const postCard = postsContainer.querySelector('.post')
        if (postCard) {
          this.stepIndent = (postsContainer.scrollLeft / (postCard.clientWidth + 40)) * 44.4
        }
      }
    }, 30),
  }
})
