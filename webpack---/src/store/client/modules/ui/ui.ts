import { Module, Commit } from 'vuex'
import uniqueId from 'lodash/uniqueId'
import Modal from '@/models-ts/Modal'
import { IUiState } from './types'

const getInitialState = (): IUiState => ({
  modalStack: [],
  accountType: null,
  last2FAConfirmation: null,
})

const ui = (): Module<IUiState, any> => {
  return ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
      resetState (state: IUiState) {
        Object.assign(state, getInitialState())
      },
      addToModalStack: (state: IUiState, modalData: Modal) => {
        state.modalStack.push(modalData)
      },
      updateModalProps: (state: IUiState, { id, props }: { id: string, props: object }) => {
        if (state.modalStack.length === 0) return
        if (state.modalStack.length === 1) {
          state.modalStack = [
            {
              ...state.modalStack[0],
              props: {
                ...(state.modalStack?.[0]?.props || {}),
                ...props
              }
            }
          ]
          return
        }
        const index = state.modalStack.findIndex((modal: any) => modal.id === id)
        state.modalStack = [
          ...state.modalStack.slice(0, index),
          {
            ...state.modalStack[index],
            props: {
              ...(state.modalStack?.[index]?.props || {}),
              ...props
            }
          },
          ...state.modalStack.slice(index + 1, state.modalStack.length),
        ]
      },
      removeFromModalStack: (state: IUiState, id: string) => {
        if (id) {
          const index = state.modalStack.findIndex((modal: any) => modal.id === id)
          if (index !== -1) {
            state.modalStack.splice(index, 1)
          }
        } else {
          state.modalStack.pop()
        }
      },
      setAccountType (state, accountType) {
        state.accountType = accountType
      },
      confirmed2FA (state) {
        state.last2FAConfirmation = (new Date()).toISOString()
      },
    },
    actions: {
      resetState ({ commit }: { commit: Commit }) {
        commit('resetState')
      },
      openModal: ({ state, commit }: { state: IUiState, commit: Commit }, modalData: Modal) => {
        if (modalData.id && state.modalStack.find((modal: Modal) => modal.id === modalData.id)) {
          return modalData.id
        }
        const id = modalData.id || uniqueId('modal_')
        commit('addToModalStack', { ...modalData, id })
        return id
      },
      closeModal: ({ commit }: { commit: Commit }, id: string | null) => {
        commit('removeFromModalStack', typeof id === 'string' ? id : null)
      },
    },
  })
}

export default ui
