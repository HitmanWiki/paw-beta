import {
  BROWSE_JOBS,
  BROWSE_JOBS_BY_SKILL,
  FREELANCERS_LIST,
  FREELANCERS_LIST_BY_SKILL,
  SERVICES,
  SERVICE_BY_SKILL,
} from '@/constants-ts/routes'
import Skill from '@/models-ts/Skill'
import Vue from 'vue'
import skillableMixin from './skillableMixin'
import { mapGetters } from 'vuex'
import { SubcategoriesWithSkills } from '@/store/shared/modules/skills/types'

export default Vue.extend<any, any, any, any>({
  mixins: [skillableMixin],
  computed: {
    ...mapGetters({
      categories: 'skills/getCategories',
      getChilds: 'skills/getChilds',
    }),
    isGigs () {
      return this.$route.name === SERVICES || this.$route.name === SERVICE_BY_SKILL
    },
    isJobs () {
      return this.$route.name === BROWSE_JOBS || this.$route.name === BROWSE_JOBS_BY_SKILL
    },
    isFreelancers () {
      return this.$route.name === FREELANCERS_LIST || this.$route.name === FREELANCERS_LIST_BY_SKILL
    },
    sortedCategories () {
      const sort = (a: Skill, b: Skill) => {
        const aI = SORTED_URLS.findIndex(url => url === a.url)
        const bI = SORTED_URLS.findIndex(url => url === b.url)
        return aI > bI ? 1 : -1
      }
      const array = [...this.categories]
      return array.sort(sort)
    },
  },
  methods: {
    getSkillUrl (skill: Skill) {
      if (this.isGigs) {
        return { name: SERVICE_BY_SKILL, params: { skill: skill.url } }
      }
      if (this.isJobs) {
        return { name: BROWSE_JOBS_BY_SKILL, params: { skill: skill.url } }
      }
      if (this.isFreelancers) {
        return { name: FREELANCERS_LIST_BY_SKILL, params: { skill: skill.url } }
      }
    },
    hasSubCategoryContent (skill: SubcategoriesWithSkills): boolean {
      return skill.subCategory === 'Other'
        ? skill.skills.some(this.hasContent)
        : this.hasContent(skill.subCategory)
    },
    hasContent (skill: Skill): boolean {
      const check = (skill: Skill) => {
        if (this.isGigs) return Boolean(skill.meta?.count?.gigs)
        if (this.isJobs) return Boolean(skill.meta?.count?.jobs)
        if (this.isFreelancers) return Boolean(skill.freelancers_start_of_month_counter)
      }
      if (check(skill)) return true
      const childs = this.getChilds(skill.id)
      return childs.some(check)
    },
  }
})

const SORTED_URLS = [
  'blockchain-and-crypto',
  'development',
  'design-and-creative',
  'nft',
  'sales-and-marketing',
  'ai',
  'writing',
  'engineering-and-architecture',
  'translation',
  'it-and-networking',
  'legal',
  'support',
  'customer-service',
  'accounting-and-consulting',
  'gaming',
  'audio-and-video',
  'offline',
  'influencers',
  'article-writing',
]
