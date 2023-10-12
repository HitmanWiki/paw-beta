import LoadableModel from '@/models-ts/LoadableModel'
import { MutationTree } from 'vuex'
import { ISkillsState } from './types'

export default {
  beforeReady (state) {
    state.skills = new LoadableModel(state.skills)
  },
  setSkillsLoading: (state) => {
    state.skills.loading()
  },
  setSkillsLoaded: (state, skills) => {
    state.skills.loaded(skills)
  },
  setSkillDetails: (state, skill) => {
    state.skillDetails = skill
  },
} as MutationTree<ISkillsState>
