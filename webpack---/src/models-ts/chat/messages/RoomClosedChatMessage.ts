import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class RoomClosedChatMessage extends AbstractChatMessage {
  type = MessageTypes.ROOM_CLOSED
  body: {
    reason: string
  }

  constructor (data: RoomClosedChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: RoomClosedChatMessageServerProps) {
    return new RoomClosedChatMessage(data)
  }

  getShortMessage () {
    return 'This room has been closed'
  }
}

export type RoomClosedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.ROOM_CLOSED
  body: {
    reason: string
  }
}
