import Vue from 'vue'
import { FREELANCERS_LIST_BY_SKILL, FREELANCERS_LIST } from '@/constants-ts/routes'
import skillableMixin from '@/mixins/skillableMixin'
import Skill from '@/models-ts/Skill'

export default Vue.extend<any, any, any, any>({
  mixins: [skillableMixin],
  data () {
    return {
      selectedSkill: null,
      FREELANCERS_LIST,
    }
  },
  computed: {
    skillTagOptions () {
      return this.predefinedSkills.slice(0, 5).map((skill: Skill) => ({
        label: skill.name,
        link: { name: FREELANCERS_LIST_BY_SKILL, params: { skill: skill.url } }
      }))
    },
  },
  methods: {
    onSubmit () {
      if (this.selectedSkill) {
        this.$router.push({ name: FREELANCERS_LIST_BY_SKILL, params: { skill: this.selectedSkill.url } })
      }
    },
  },
})
