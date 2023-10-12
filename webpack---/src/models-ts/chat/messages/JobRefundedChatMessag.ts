import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { Roles } from '@/constants-ts/user/roles'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobRefundedChatMessage extends AbstractChatMessage {
  type = MessageTypes.JOB_REFUNDED
  body: {
    reason: string
  }

  constructor (data: JobRefundedChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: JobRefundedChatMessageServerProps) {
    return new JobRefundedChatMessage(data)
  }

  getShortMessage (userId: string, role: Roles) {
    const isOwn = this.sender === `${userId}:${role}`
    return isOwn ? 'You have requested a refund' : 'Customer requested a refund'
  }
}

export type JobRefundedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_REFUNDED
  body: {
    reason: string
  }
}
