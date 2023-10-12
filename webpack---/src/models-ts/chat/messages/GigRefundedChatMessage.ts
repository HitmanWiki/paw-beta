import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { Roles } from '@/constants-ts/user/roles'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class GigRefundedChatMessage extends AbstractChatMessage {
  type = MessageTypes.GIG_REFUNDED
  body: {
    reason: string
  }

  constructor (data: GigRefundedChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: GigRefundedChatMessageServerProps) {
    return new GigRefundedChatMessage(data)
  }

  getShortMessage (userId: string, role: Roles) {
    const isOwn = this.sender === `${userId}:${role}`
    return isOwn ? 'You have requested a refund' : 'Customer requested a refund'
  }
}

export type GigRefundedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.GIG_REFUNDED
  body: {
    reason: string
  }
}
