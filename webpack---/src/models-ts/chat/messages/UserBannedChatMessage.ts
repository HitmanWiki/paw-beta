import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class UserBannedChatMessage extends AbstractChatMessage {
  type = MessageTypes.USER_BAN
  body: {
    reason: string
  }

  constructor (data: UserBannedChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: UserBannedChatMessageServerProps) {
    return new UserBannedChatMessage(data)
  }

  getShortMessage () {
    return 'User was banned'
  }
}

export type UserBannedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.USER_BAN
  body: {
    reason: string
  }
}
