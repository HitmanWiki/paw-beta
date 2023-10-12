import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { GigOfferStages } from '@/constants-ts/gig/gigOfferStages'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class GigOfferChatMessage extends AbstractChatMessage {
  type = MessageTypes.GIG_OFFER
  budget?: string
  deadline?: number
  message: string
  timeType: number
  timeValue: number
  offerId: number
  stage: GigOfferStages
  isEscrowed: boolean

  constructor (data: GigOfferChatMessageServerProps) {
    super(data)
    this.message = data.body.message
    this.body = data.body.message
    this.budget = data.body.rate
    this.deadline = data.body.deadline
    this.timeType = data.body.time_type
    this.timeValue = data.body.time_value
    this.offerId = data.entityId
    this.stage = data.body.stage
    this.isEscrowed = !!data.body.is_escrowed
  }

  static fromServer (data: GigOfferChatMessageServerProps) {
    return new GigOfferChatMessage({ ...data, body: data.body })
  }

  getShortMessage () {
    return this.message
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }
}

export type GigOfferChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.GIG_OFFER
  body: {
    message: string
    rate: string
    deadline?: number
    stage: GigOfferStages
    time_type: number
    time_value: number
    is_escrowed: boolean
  }
  entityId: number
}
