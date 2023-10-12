import Vue from 'vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import PublicFooter from '@/partials/PublicFooter/PublicFooter.vue'
import LxHeader from '@/partials/LxHeader/LxHeader.vue'
import { DASHBOARD } from '@/constants-ts/routes'
import { exchangeSocialTemporaryToken } from '@/api/usersAndProfiles/auth'
import { stripDescriptionTags } from '@/utils-ts/strings'
import Skill from '@/models-ts/Skill'
import { SALARY_FIXED, SALARY_RANGE } from '@/constants-ts/vacancies/salaryTypes'
import { META_COUNTRIES } from '@/constants-ts/meta'
import Benefits from './Benefits/Benefits.vue'
import Blog from './Blog/Blog.vue'
import Faq from './Faq/Faq.vue'
import FeaturedIn from './FeaturedIn/FeaturedIn.vue'
import GetPremium from './GetPremium/GetPremium.vue'
import LaborxPlatform from './LaborxPlatform/LaborxPlatform.vue'
import NewCryptoJobs from './NewCryptoJobs/NewCryptoJobs.vue'
import NewGigs from './NewGigs/NewGigs.vue'
import OurProducts from './OurProducts/OurProducts.vue'
import Skills from './Skills/Skills.vue'
import { addMonths, formatDate } from '@/utils/date'
import { DATE_TIME_FORMAT_WITHOUT_SEC } from '@/constants/date'

const metaTotal = '600+'
const metaTotalNew = '27'
const metaTitle = `${metaTotal} Crypto JOBS: WEB3, Freelance & Blockchain in 2023 (${metaTotalNew} new!)`
// eslint-disable-next-line max-len
const metaDescription = `Ready to take on the NEXT frontier in tech? 👨‍💻 Explore ${metaTotal} blockchain-based jobs in Web3, Cryptocurrency & Bitcoin 💵 Join the revolution & shape your future with our latest job listings today! Apply now!`

export default Vue.extend<any, any, any, any>({
  components: {
    Benefits,
    Blog,
    Faq,
    FeaturedIn,
    GetPremium,
    LaborxPlatform,
    NewCryptoJobs,
    NewGigs,
    OurProducts,
    PublicFooter,
    LxHeader,
    Skills,
  },
  data () {
    return {
      preloading: false,
    }
  },
  computed: {
    ...mapState('app', {
      isLoggedIn: (state: any) => state.authorized,
    }),
    ...mapState('landing', {
      gigsCount: (state: any) => state.gigsCount,
      jobsCount: (state: any) => state.jobsCount,
    }),
    ...mapGetters({
      posts: 'blog/lastPosts',
      jobs: 'landing/jobListPublic',
      gigs: 'landing/gigListPublic',
      vacancies: 'landing/vacancyListPublic',
    }),
  },
  async prefetch () {
    if (process.server) {
      await this.getLandingData()
    }
  },
  async created () {
    if (process.client) {
      if (!this.posts.length || !this.gigsCount || !this.jobsCount) {
        try {
          this.preloading = true
          await this.getLandingData()
        } finally {
          this.preloading = false
        }
      }
    }
  },
  async mounted () {
    if (this.$route.query.action && this.$route.query.action === 'reset') {
      this.openModal({
        component: 'lx-reset-modal',
        props: {
          token: this.$route.query.token
        }
      })
      this.$router.replace({ query: null })
    } else if (this.$route.query.action === '2fa') {
      const token = this.$route.query.token
      this.openModal({
        component: 'lx-confirm-2fa-modal',
        props: {
          confirm: async (key: string) => {
            const newToken = await exchangeSocialTemporaryToken(token, key)
            this.setToken(newToken.token)
            this.$router.push({ name: DASHBOARD })
          }
        }
      })
      this.$router.replace({ query: null })
    } else if (this.$route.query.token) {
      this.openModal({
        component: 'lx-sign-up-social-modal',
        props: {
          token: this.$route.query.token,
          authClient: this.$route.query.authclient,
          viaLogin: !!Number(this.$route.query.module),
        }
      })
      this.$router.replace({ query: null })
    } else if (this.$route.query.error) {
      this.openModal({
        component: 'lx-composite-modal',
        props: {
          title: 'Error',
          text: this.$route.query.error
        }
      })
      this.$router.replace({ query: null })
    } else if ((this.$route.query || {}).hasOwnProperty('sign-up') && !this.isLoggedIn) {
      this.openModal({
        component: 'lx-sign-up-modal',
        props: {
          fromType: 'fromType',
        }
      })
    }
  },
  methods: {
    ...mapActions({
      openModal: 'ui/openModal',
      setToken: 'app/setToken',
      getLandingData: 'landing/getLandingData',
    }),
  },
  metaInfo () {
    const script = []
    const getBudgetUnit = (budget: number) => {
      if (budget < 50) {
        return 'HOUR'
      } else if (budget < 200) {
        return 'DAY'
      } else if (budget < 1000) {
        return 'WEEK'
      }
      return 'MONTH'
    }
    const defaultLocations = META_COUNTRIES.map(name => ({
      '@type': 'Country', name
    }))
    for (let job of this.jobs) {
      script.push({
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org',
          '@type': 'JobPosting',
          title: job.name,
          description: stripDescriptionTags(job.description, { stripLinks: true }),
          employmentType: 'CONTRACTOR',
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: defaultLocations,
          hiringOrganization: {
            '@type': 'Organization',
            name: job.user.name,
            ...(job.user.avatar?.src && { logo: job.user.avatar.src }),
            ...(job.userWebsite && { sameAs: job.userWebsite }),
          },
          occupationalCategory: job.skills.length > 0 ? job.skills[0].name : '',
          ...(job.skills.length > 1 && { skills: job.skills.slice(1).map((s: Skill) => s.name).join(', ') }),
          estimatedSalary: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
              '@type': 'QuantitativeValue',
              value: job.budget,
              unitText: getBudgetUnit(Number(job.budget)),
            },
          },
          datePosted: formatDate(job.publishedAt, 'YYYY-MM-DD'),
          validThrough: formatDate(addMonths(job.publishedAt, 6), DATE_TIME_FORMAT_WITHOUT_SEC),
        }
      })
    }
    for (let vacancy of this.vacancies) {
      script.push({
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org',
          '@type': 'JobPosting',
          title: vacancy.name,
          description: stripDescriptionTags(vacancy.description, { stripLinks: true }),
          ...((vacancy.positionRemote && !vacancy.positionOffice) && {
            jobLocationType: 'TELECOMMUTE',
            applicantLocationRequirements: vacancy.countryName
              ? { '@type': 'Country', name: vacancy.countryName }
              : defaultLocations
          }),
          ...(vacancy.positionOffice && {
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressCountry: vacancy.countryName,
                addressRegion: vacancy.cityName,
              }
            }
          }),
          hiringOrganization: {
            '@type': 'Organization',
            name: vacancy.user.name,
            ...(vacancy.user.avatar?.src && { logo: vacancy.user.avatar.src }),
          },
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
              '@type': 'QuantitativeValue',
              unitText: 'YEAR',
              ...(vacancy.salary_type === SALARY_FIXED && { value: vacancy.salary_from }),
              ...(vacancy.salary_type === SALARY_RANGE && { minValue: vacancy.salary_from, maxValue: vacancy.salary_to }),
            },
          },
          datePosted: formatDate(vacancy.publishedAt, 'YYYY-MM-DD'),
          validThrough: formatDate(addMonths(vacancy.publishedAt, 6), DATE_TIME_FORMAT_WITHOUT_SEC),
        }
      })
    }
    return {
      title: metaTitle,
      titleTemplate: '%s',
      meta: [
        {
          vmid: 'description',
          name: 'description',
          content: metaDescription,
        },
        {
          vmid: 'og:title',
          property: 'og:title',
          content: metaTitle,
        },
        {
          vmid: 'og:description',
          property: 'og:description',
          content: metaDescription,
        },
        {
          vmid: 'og:type',
          property: 'og:type',
          content: 'website',
        },
        {
          vmid: 'og:image',
          property: 'og:image',
          content: `${process.env.VUE_APP_FRONTEND_URL}/static/images/preview/preview.png`
        },
        {
          vmid: 'twitter:card',
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          vmid: 'twitter:image',
          property: 'twitter:src',
          content: `${process.env.VUE_APP_FRONTEND_URL}/static/images/preview/landing/twitter.png`
        },
      ],
      script,
      link: [
        {
          vmid: 'canonical',
          rel: 'canonical',
          href: `${process.env.VUE_APP_FRONTEND_URL}/`,
        },
      ]
    }
  },
})
