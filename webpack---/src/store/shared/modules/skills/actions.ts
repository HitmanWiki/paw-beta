import { ActionTree } from 'vuex'
import { ISkillsState } from './types'
import { RootState } from '@/store'
import { getSkill, getSkills } from '@/api/skills'
import Skill from '@/models-ts/Skill'

export default {
  async getSkills ({ commit, state }): Promise<Array<Skill>> {
    if (state.skills.isLoaded) {
      return state.skills.value
    }
    if (state.skills.isLoading && state.skills.promise) {
      return state.skills.promise.promise
    }
    commit('setSkillsLoading')
    const skillsData = await getSkills()
    const skills = skillsData.map(Skill.fromServer)
    commit('setSkillsLoaded', skills)
    return skills
  },
  async getSkillDetails ({ state, commit }, skillUrl = '') {
    if (state.skillDetails && state.skillDetails.url?.toLowerCase() === skillUrl.toLowerCase()) {
      return state.skillDetails
    }
    const skill = await getSkill(skillUrl)
    commit('setSkillDetails', skill)
    return skill
  },
} as ActionTree<ISkillsState, RootState>
