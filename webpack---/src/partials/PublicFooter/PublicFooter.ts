import Vue from 'vue'
import {
  ABOUT_US,
  BROWSE_JOBS,
  FREELANCERS_LIST,
  BLOG,
  JOB_MINING,
  SKILLS_LIST,
  PREMIUM,
  LANDING,
  SERVICES,
  VACANCIES,
  BROWSE_JOBS_BY_SKILL
} from '@/constants-ts/routes'

const CATEGORY_LINKS = [
  {
    label: 'Design & Creative Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'design-and-creative' } },
  },
  {
    label: 'Web, Mobile & Software Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'development' } },
  },
  {
    label: 'Writing Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'writing' } },
  },
  {
    label: 'Sales & Marketing Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'sales-and-marketing' } },
  },
  {
    label: 'IT & Networking Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'it-and-networking' } },
  },
]

const CRYPTO_LINKS = [
  {
    label: 'Ethereum Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'ethereum' } },
  },
  {
    label: 'NFT Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'nft' } },
  },
  {
    label: 'Blockchain Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'blockchain-and-crypto' } },
  },
  {
    label: 'Solidity Jobs',
    link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: 'solidity' } },
  },
]

export default Vue.extend({
  data () {
    return {
      ABOUT_US,
      BLOG,
      BROWSE_JOBS,
      FREELANCERS_LIST,
      JOB_MINING,
      SKILLS_LIST,
      PREMIUM,
      SERVICES,
      currentYear: new Date().getFullYear(),
      CATEGORY_LINKS,
      CRYPTO_LINKS,
      VACANCIES,
    }
  },
  methods: {
    onClickMain () {
      if (this.$route.name === LANDING) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
  },
})
