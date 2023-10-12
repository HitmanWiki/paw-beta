import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class SystemChatMessage extends AbstractChatMessage {
  body: string = ''

  constructor (data: SystemChatMessageServerProps) {
    super(data)
    this.body = data.body as string
  }

  static fromServer (data: SystemChatMessageServerProps) {
    if (data.body instanceof Object) {
      return new SystemChatMessage({ ...data, body: data.body.comment })
    } else {
      return new SystemChatMessage(data)
    }
  }

  getShortMessage () {
    switch (this.type) {
      case MessageTypes.ROOM_CLOSED: return 'This room has been closed'
      default: return ''
    }
  }
}

export type SystemChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.ROOM_CLOSED
  body: string | { comment: string }
}
