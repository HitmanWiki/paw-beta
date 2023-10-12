import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { getInitialState } from './helper'

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations,
  getters,
  actions,
})
