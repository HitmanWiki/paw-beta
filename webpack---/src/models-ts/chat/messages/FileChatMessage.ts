import cloneDeep from 'lodash/cloneDeep'
import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class FileChatMessage extends AbstractChatMessage {
  declare body: {
    name: string
    url: string | null
    size: number // in bytes
  }

  constructor ({ body, ...data }: FileChatMessageServerProps) {
    super(data)
    Object.assign(this, cloneDeep({
      body: {
        name: body.description || body.name,
        url: body.url,
        size: Number(body.size)
      }
    }))
  }

  static fromServer (data: FileChatMessageServerProps) {
    return new FileChatMessage(data)
  }

  getShortMessage () {
    return `File: ${this.body.name}`
  }
}

export type FileChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.FILE
  body: {
    name: string
    description: string
    url: string | null
    size: string | number
  }
}
