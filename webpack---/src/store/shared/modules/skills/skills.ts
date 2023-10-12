import { ISkillsState } from './types'
import { Module } from 'vuex'
import { RootState } from '@/store'
import LoadableModel from '@/models-ts/LoadableModel'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const getInitialState = (): ISkillsState => ({
  skills: new LoadableModel({ value: [] }),
  skillDetails: null,
})

export default (): Module<ISkillsState, RootState> => ({
  namespaced: true,
  state: getInitialState(),
  mutations,
  getters,
  actions,
})
