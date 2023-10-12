import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class TextChatMessage extends AbstractChatMessage {
  body: string = ''

  constructor (data: TextChatMessageServerProps) {
    super(data)
    this.body = data.body as string
  }

  static fromServer (data: TextChatMessageServerProps) {
    return new TextChatMessage(data)
  }
}

export type TextChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.TEXT | MessageTypes.LINK
  body: string
}
