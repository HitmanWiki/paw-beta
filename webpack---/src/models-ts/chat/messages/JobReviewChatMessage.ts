import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobReviewChatMessage extends AbstractChatMessage {
  type = MessageTypes.JOB_REVIEW
  body: string = ''
  rates: Array<{
    category: number,
    rate: number,
  }>
  fromFreelancer: boolean

  constructor (data: JobReviewChatMessageServerProps) {
    super(data)
    this.body = data.body.text
    this.fromFreelancer = data.body.type === 2
    this.rates = (data.body.relations?.Rate || []).map(rate => ({ category: rate.category, rate: rate.rate }))
  }

  static fromServer (data: JobReviewChatMessageServerProps) {
    return new JobReviewChatMessage(data)
  }

  getShortMessage () {
    return this.body || 'Review'
  }
}

export type JobReviewChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_REVIEW
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
