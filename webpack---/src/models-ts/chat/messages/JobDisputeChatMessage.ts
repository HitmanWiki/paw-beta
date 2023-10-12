import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { JobStage, STAGE_BLOCKED_BY_FREELANCER } from '@/constants-ts/job/jobStages'
import { Roles } from '@/constants-ts/user/roles'
import BigNumber from 'bignumber.js'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobDisputeChatMessage extends AbstractChatMessage {
  type = MessageTypes.JOB_DISPUTE
  body: {
    customerStake: string
    freelancerStake: string
    stage: JobStage
  }

  constructor (data: JobDisputeChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: JobDisputeChatMessageServerProps) {
    return new JobDisputeChatMessage(data)
  }

  getShortMessage (userId: string, role: Roles) {
    if (this.body.stage === STAGE_BLOCKED_BY_FREELANCER) return 'Dispute Case Opened'
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

export type JobDisputeChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_DISPUTE
  body: {
    customerStake: string
    freelancerStake: string
    stage: JobStage
  }
}
