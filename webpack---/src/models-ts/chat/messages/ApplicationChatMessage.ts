import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { formatUsd } from '@/utils/moneyFormat'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class ApplicationChatMessage extends AbstractChatMessage {
  body: string = ''
  budget?: number
  deadline?: number
  type = MessageTypes.TEXT
  comment: string

  constructor (data: ApplicationChatMessageServerProps) {
    super(data)
    this.comment = data.body.comment
    this.budget = data.body.budget
    this.deadline = data.body.deadline
    this.body = this.budget || this.deadline
      ? `${data.body.comment}\n`
      : data.body.comment
    if (this.budget) {
      this.body = `${this.body}\nProposed budget: $${this.budget ? formatUsd(this.budget) : 'Not specified'}`
    }
    if (this.deadline) {
      this.body = `${this.body}\nProposed deadline in days: ${this.deadlineInDays || 'Not specified'}`
    }
  }

  static fromServer (data: ApplicationChatMessageServerProps) {
    return new ApplicationChatMessage({ ...data, body: data.body })
  }

  getShortMessage () {
    return this.comment || 'New application'
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }
}

export type ApplicationChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.TEXT
  body: {
    comment: string
    budget?: number
    deadline?: number
  }
}
