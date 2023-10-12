import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobUnavailableChatMessage extends AbstractChatMessage {
  constructor (data: JobUnavailableChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: JobUnavailableChatMessageServerProps) {
    return new JobUnavailableChatMessage(data)
  }

  getShortMessage () {
    return 'This Job was removed by the customer.'
  }
}

export type JobUnavailableChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_UNPUBLISHED | MessageTypes.JOB_REMOVED
  body: {
    reason: string
  }
}
