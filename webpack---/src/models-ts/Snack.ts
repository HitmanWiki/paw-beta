import { SnackTypes } from '@/constants-ts/SnackTypes'

export default class Snack {
  timeoutId?: any
  id?: any
  type?: SnackTypes
  text: string
  duration?: number
  closable?: boolean
  onCloseCb?: Function
  constructor (props: Partial<Snack>) {
    Object.assign(this, props)
  }
}
