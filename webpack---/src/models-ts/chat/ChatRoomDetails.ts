import { RoomStages } from '@/constants-ts/chat/RoomStages'
import { RoomTypes } from '@/constants-ts/chat/RoomTypes'
import { JOB_CHAT, SERVICE_CHAT, VACANCY_CHAT } from '@/constants-ts/routes'
import { getDateFromString } from '@/utils/date'
import cloneDeep from 'lodash/cloneDeep'
import ChatParticipant, { ChatParticipantServerProps } from './ChatParticipant'

export default class ChatRoomDetails {
  id: string
  isClosed: boolean
  isUnlocked: boolean
  type: RoomTypes
  updatedAt: Date
  lastMessageAt: Date
  participants: Array<ChatParticipant>
  entity: {
    id: number
    slug: string
    name: string
  }
  temporary: boolean
  customerStage: RoomStages
  freelancerStage: RoomStages
  unreadCount: number

  constructor (data: Partial<ChatRoomDetails>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: ChatRoomDetailsServerProps) {
    const slugParsed = data.entity.slug.match(/^(.*)-(\d*$)/)
    const entityId = Number(slugParsed ? slugParsed[2] : 0)
    const entitySlug = slugParsed ? slugParsed[1] : ''
    return new ChatRoomDetails({
      id: data.id,
      type: data.type,
      isClosed: data.isClosed,
      isUnlocked: data.hasOwnProperty('isUnlocked') ? data.isUnlocked : true,
      updatedAt: getDateFromString(data.updatedAt),
      lastMessageAt: getDateFromString(data.lastMessageAt),
      participants: (data.participants || []).map(ChatParticipant.fromServer),
      unreadCount: data.unreadCount,
      entity: {
        id: entityId,
        slug: entitySlug,
        name: data.entity.name,
      },
      customerStage: data.customerStage,
      freelancerStage: data.freelancerStage,
    })
  }
  static parseRoomId (id: string) {
    const [type, applicationId] = id.split(':')
    return { type, applicationId }
  }

  static generateRoomId (
    { type, applicationId, freelancerId, customerId }:
    { type: number, applicationId: number, freelancerId: number, customerId: number }
  ) {
    const ids = [1, 2, freelancerId, customerId].sort((a, b) => a - b).join(':')
    return `${type}:${applicationId}:${ids}`
  }

  get chatLink () {
    const commonProps = {
      params: { id: this.entity.id, slug: this.entity.slug },
      query: { room: this.id }
    }
    switch (this.type) {
      case RoomTypes.GIG: return {
        ...commonProps,
        name: SERVICE_CHAT,
      }
      case RoomTypes.JOB: return {
        ...commonProps,
        name: JOB_CHAT,
      }
      case RoomTypes.VACANCY: return {
        ...commonProps,
        name: VACANCY_CHAT,
      }
    }
  }

  get applicationId () {
    const { applicationId } = ChatRoomDetails.parseRoomId(this.id)
    return applicationId
  }
}

export type ChatRoomDetailsServerProps = {
  id: string
  isClosed: boolean
  isUnlocked: boolean
  type: RoomTypes
  updatedAt: string
  lastMessageAt: string
  participants: Array<ChatParticipantServerProps>
  customerStage: RoomStages
  freelancerStage: RoomStages
  unreadCount: number
  entity: {
    id: number
    slug: string
    name: string
  }
}
