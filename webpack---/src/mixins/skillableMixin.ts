
import Skill from '@/models-ts/Skill'
import { ISkillsState } from '@/store/shared/modules/skills/types'
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

type Mapped =
  Record<'skillsLoaded', (state: ISkillsState) => boolean> &
  Record<'predefinedSkills', (state: ISkillsState) => Array<Skill>>

export default Vue.extend({
  computed: {
    ...mapState<ISkillsState, Mapped>('skills', {
      predefinedSkills: state => state.skills.value,
      skillsLoaded: state => state.skills.isLoaded
    }),
  },
  async prefetch () {
    try {
      if (!this.skillsLoaded) {
        await this.getSkills()
      }
    } catch (e) {
      console.error('Error loading skills', e)
    }
  },
  methods: {
    ...mapActions({
      getSkills: 'skills/getSkills',
    }),
  }
})
