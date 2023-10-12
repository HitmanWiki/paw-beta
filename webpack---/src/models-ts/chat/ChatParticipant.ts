import cloneDeep from 'lodash/cloneDeep'
import { Roles } from '@/constants-ts/user/roles'

export default class ChatParticipant {
  id: string
  avatar: string
  name: string
  isBanned: boolean
  isRemoved: boolean
  isOnline: boolean

  constructor (data: Partial<ChatParticipant>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: ChatParticipantServerProps) {
    return new ChatParticipant({
      id: data.id,
      avatar: data.avatar,
      name: data.name || '',
      isBanned: data.isBanned,
      isRemoved: data.isRemoved,
      isOnline: data.isOnline,
    })
  }

  get userId () {
    return this.id.split(':')[0]
  }

  static parseId (userId: string) {
    return userId.split(':')[0]
  }

  static toSenderId (userId: string, role: Roles) {
    return `${userId}:${role}`
  }
}

export type ChatParticipantServerProps = {
  id: string
  avatar: string
  name: string
  isBanned: boolean
  isRemoved: boolean
  isOnline: boolean
}
