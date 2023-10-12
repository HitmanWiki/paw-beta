import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { JobOfferStagesInChat } from '@/constants-ts/job/jobOfferStages'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobOfferChatMessage extends AbstractChatMessage {
  type = MessageTypes.JOB_OFFER
  budget?: string
  deadline?: number
  message: string
  offerId: number
  stage: JobOfferStagesInChat
  isEscrowed: boolean

  constructor (data: JobOfferChatMessageServerProps) {
    super(data)
    this.message = data.body.message
    this.body = data.body.message
    this.budget = data.body.budget
    this.deadline = data.body.deadline
    this.offerId = data.entityId
    this.stage = data.body.stage
    this.isEscrowed = !!data.body.is_escrowed
  }

  static fromServer (data: JobOfferChatMessageServerProps) {
    return new JobOfferChatMessage({ ...data, body: data.body })
  }

  getShortMessage () {
    return this.message
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }
}

export type JobOfferChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_OFFER
  body: {
    message: string
    budget: string
    deadline?: number
    stage: JobOfferStagesInChat
    is_escrowed: boolean
  }
  entityId: number
}
