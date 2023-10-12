import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobMarkedDoneChatMessage extends AbstractChatMessage {
  type = MessageTypes.JOB_MARK_IS_DONE
  isPayed: boolean
  markIsDone: boolean
  initiator?: string

  constructor (data: JobMarkedDoneChatMessageServerProps) {
    super(data)
    this.body = null
    this.isPayed = data.body.is_payed
    this.markIsDone = data.body.mark_is_done
    this.initiator = data.body.mark_not_done_initiator
  }

  static fromServer (data: JobMarkedDoneChatMessageServerProps) {
    return new JobMarkedDoneChatMessage(data)
  }

  getShortMessage () {
    return 'Talent marked job as complete'
  }
}

export type JobMarkedDoneChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_MARK_IS_DONE
  body: {
    is_payed: boolean
    mark_is_done: boolean
    mark_not_done_initiator?: string
  }
}
