import cloneDeep from 'lodash/cloneDeep'
import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { getDateFromString } from '@/utils/date'
import { Roles } from '@/constants-ts/user/roles'

export default class AbstractChatMessage {
  id: string
  deliveryId: string
  type: MessageTypes
  updatedAt: Date
  roomId: string
  sender: string
  sending: Boolean
  body: any
  readers: Array<{ readerId: string }>
  isSystem: boolean

  constructor (data: AbstractChatMessageServerProps) {
    Object.assign(this, cloneDeep({
      id: data._id,
      deliveryId: data.deliveryId,
      type: data.type,
      updatedAt: getDateFromString(data.updatedAt),
      roomId: data.roomId,
      sender: data.sender.id,
      sending: !!data.sending,
      readers: data.readers || [],
      isSystem: !!data.isSystem,
    }))
  }

  getShortMessage (userId: string, role: Roles) {
    return this.body
  }
}

export type AbstractChatMessageServerProps = {
  _id: string
  deliveryId: string
  type: MessageTypes
  updatedAt: string
  roomId: string
  sender: { id: string }
  sending: boolean
  readers: Array<{ readerId: string }>
  isSystem: boolean
}
