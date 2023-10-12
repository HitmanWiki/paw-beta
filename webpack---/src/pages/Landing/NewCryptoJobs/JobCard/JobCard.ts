import Vue from 'vue'
import LandingJob from '@/models-ts/landing/LandingJob'
import {
  JOB_DETAILS,
  BROWSE_JOBS_BY_SKILL,
  CUSTOMER_PROFILE,
  VACANCY_DETAILS
} from '@/constants-ts/routes'
import { formatCurrency } from '@/utils/moneyFormat'

export default Vue.extend<any, any, any, any>({
  props: {
    job: LandingJob
  },
  data () {
    return {
      JOB_DETAILS,
      CUSTOMER_PROFILE,
      VACANCY_DETAILS,
    }
  },
  methods: {
    formatBudget (job: LandingJob) {
      return formatCurrency(job.budget, { currency: 'USDT', minDecimal: 0, maxDecimal: 0 })
    },
    getSkillTags (job: LandingJob) {
      return job.skills
        .map(skill => ({
          text: skill.name,
          ...(!skill.is_custom && skill.url && { link: { name: BROWSE_JOBS_BY_SKILL, params: { skill: skill.url } } })
        }))
        .slice(0, 2)
    },
  },
})
