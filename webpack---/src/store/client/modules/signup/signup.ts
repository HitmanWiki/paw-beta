import { Module } from 'vuex'
import { RootState } from '@/store'
import { ISignupState } from './types'

const getInitialState = (): ISignupState => ({
  signupData: null
})

export default (): Module<ISignupState, RootState> => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getInitialState())
    },
    setData (state, data: Object) {
      state.signupData = { ...data }
    }
  },
})
