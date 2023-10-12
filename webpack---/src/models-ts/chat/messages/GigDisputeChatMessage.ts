import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { GigJobStages } from '@/constants-ts/gig/gigJobStages'
import { Roles } from '@/constants-ts/user/roles'
import BigNumber from 'bignumber.js'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class GigDisputeChatMessage extends AbstractChatMessage {
  type = MessageTypes.GIG_DISPUTE
  body: {
    customerStake: string
    freelancerStake: string
    stage: GigJobStages
  }

  constructor (data: GigDisputeChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: GigDisputeChatMessageServerProps) {
    return new GigDisputeChatMessage(data)
  }

  getShortMessage (userId: string, role: Roles) {
    if (this.body.stage === GigJobStages.BLOCKED) return 'Dispute Case Opened'
    const isFreelancer = this.sender === `${userId}:${role}`
    const myStake = new BigNumber(isFreelancer ? this.body.freelancerStake : this.body.customerStake)
    const strangerStake = new BigNumber(isFreelancer ? this.body.customerStake : this.body.freelancerStake)
    const isLost = myStake.isZero()
    const isWon = strangerStake.isZero()
    if (isWon) return 'Dispute Successful'
    if (isLost) return 'Dispute Unsuccessful'
    return `Dispute Resolved`
  }
}

export type GigDisputeChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.GIG_DISPUTE
  body: {
    customerStake: string
    freelancerStake: string
    stage: GigJobStages
  }
}
