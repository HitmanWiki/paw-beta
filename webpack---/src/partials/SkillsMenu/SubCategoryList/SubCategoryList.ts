import { SubcategoriesWithSkills } from '@/store/shared/modules/skills/types'
import Vue, { PropType } from 'vue'
import skillsUrlMixin from '@/mixins/navigationSkills'

export default Vue.extend<any, any, any, any>({
  mixins: [skillsUrlMixin],
  props: {
    list: Array as PropType<Array<SubcategoriesWithSkills>>,
  },
  computed: {
    onlyOther (): boolean {
      return this.list.length === 1 && this.list[0].subCategory === 'Other'
    },
  },
})
