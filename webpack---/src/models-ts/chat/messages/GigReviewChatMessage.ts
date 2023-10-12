import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class GigReviewChatMessage extends AbstractChatMessage {
  type = MessageTypes.GIG_REVIEW
  body: string = ''
  rates: Array<{
    category: number,
    rate: number,
  }>
  fromFreelancer: boolean

  constructor (data: GigReviewChatMessageServerProps) {
    super(data)
    this.body = data.body.text
    this.fromFreelancer = data.body.type === 2
    this.rates = (data.body.relations?.Rate || []).map(rate => ({ category: rate.category, rate: rate.rate }))
  }

  static fromServer (data: GigReviewChatMessageServerProps) {
    return new GigReviewChatMessage(data)
  }

  getShortMessage () {
    return this.body || 'Review'
  }
}

export type GigReviewChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.GIG_REVIEW
  body: {
    text: string
    type: 1 | 2
    relations: {
      Rate: Array<{
        category: number,
        rate: number,
      }>
    }
  }
}
