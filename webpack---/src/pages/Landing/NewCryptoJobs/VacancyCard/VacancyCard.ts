import Vue from 'vue'
import LandingJob from '@/models-ts/landing/LandingJob'
import {
  CUSTOMER_PROFILE,
  VACANCIES,
  VACANCY_DETAILS
} from '@/constants-ts/routes'
import { formatUsd } from '@/utils/moneyFormat'
import { SALARY_FIXED } from '@/constants-ts/vacancies/salaryTypes'
import LandingVacancy from '@/models-ts/landing/LandingVacancy'

export default Vue.extend<any, any, any, any>({
  props: {
    vacancy: LandingVacancy,
  },
  data () {
    return {
      CUSTOMER_PROFILE,
      VACANCY_DETAILS,
    }
  },
  methods: {
    getSkillTags (job: LandingJob) {
      return job.skills
        .map(skill => ({
          text: skill.name,
          ...(!skill.is_custom && skill.url && { link: { name: VACANCIES, query: { skills: skill.id } } })
        }))
        .slice(0, 2)
    },
    getVacancySalary (vacancy: LandingVacancy) {
      if (vacancy.salary_type === SALARY_FIXED) {
        return formatUsd(vacancy.salary_from)
      }
      return `${formatUsd(vacancy.salary_from)}-${formatUsd(vacancy.salary_to)}`
    },
  },
})
