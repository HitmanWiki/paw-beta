import storeFromContext from '@/store/storeFromContext'
import { SnackTypes } from '@/constants-ts/SnackTypes'

export function openSnackbar (
  { id, type = SnackTypes.SUCCESS, title, text, duration = 3000, onCloseCb = () => {}, closable = false }:
  { id?: any, type?: SnackTypes, title?: string, text: string, duration?: number, onCloseCb?: Function, closable?: boolean }) {
  const store = storeFromContext()
  store.dispatch('snacks/openSnackbar', {
    id,
    type,
    text,
    closable,
    duration: [SnackTypes.LOADING, SnackTypes.LOADING_WITH_CLOSE].includes(type) ? -1 : duration,
    onCloseCb,
  })
}

export function closeSnackbar (id: any) {
  const store = storeFromContext()
  store.dispatch('snacks/deleteSnackbar', id)
}
