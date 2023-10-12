import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class GigMarkedDoneChatMessage extends AbstractChatMessage {
  type = MessageTypes.GIG_MARK_IS_DONE
  isPayed: boolean
  markIsDone: boolean
  initiator?: string

  constructor (data: GigMarkedDoneChatMessageServerProps) {
    super(data)
    this.body = null
    this.isPayed = data.body.is_payed
    this.markIsDone = data.body.mark_is_done
    this.initiator = data.body.mark_not_done_initiator
  }

  static fromServer (data: GigMarkedDoneChatMessageServerProps) {
    return new GigMarkedDoneChatMessage(data)
  }

  getShortMessage () {
    return 'Talent marked gig as complete'
  }
}

export type GigMarkedDoneChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.GIG_MARK_IS_DONE
  body: {
    is_payed: boolean
    mark_is_done: boolean
    mark_not_done_initiator?: string
  }
}
