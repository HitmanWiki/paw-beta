import { Commit } from 'vuex'
import uniqueId from 'lodash/uniqueId'
import { SnackTypes } from '@/constants-ts/SnackTypes'
import Snack from '@/models-ts/Snack'
import { ISnacksState } from './types'

const getInitialState = (): ISnacksState => ({
  snacks: [],
})

export default () => ({
  namespaced: true,
  state: getInitialState(),
  mutations: {
    addSnackbar (state: ISnacksState, snack: Snack) {
      state.snacks.push(snack)
    },
    deleteSnackbar (state: ISnacksState, id: any) {
      const snackIndex = state.snacks.findIndex((snack: Snack) => snack.id === id)
      if (snackIndex !== -1) {
        state.snacks.splice(snackIndex, 1)
      }
    },
  },
  actions: {
    openSnackbar ({ commit }: { commit: Commit }, snack: Snack) {
      const newSnack = new Snack({
        closable: false,
        duration: 3000,
        type: SnackTypes.SUCCESS,
        onCloseCb: () => {},
        ...snack,
        id: snack.id || uniqueId(),
      })
      if (newSnack.duration && newSnack.duration > 0) {
        newSnack.timeoutId = setTimeout(() => commit('deleteSnackbar', newSnack.id), newSnack.duration + 500)
      }
      commit('addSnackbar', newSnack)
    },
    deleteSnackbar ({ commit, state }: { commit: Commit, state: ISnacksState }, id: any) {
      const snack = state.snacks.find((s: Snack) => s.id === id)
      if (snack) {
        if (snack.timeoutId) {
          clearTimeout(snack.timeoutId)
        }
        commit('deleteSnackbar', snack.id)
      }
    }
  }
})
