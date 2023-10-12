import Vue from 'vue'
import { VACANCY_ADD, VACANCIES } from '@/constants-ts/routes'

export default Vue.extend({
  data () {
    return {
      VACANCIES,
      VACANCY_ADD,
    }
  }
})
