import cloneDeep from 'lodash/cloneDeep'
import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class ImageChatMessage extends AbstractChatMessage {
  declare body: {
    name: string
    url: string | null
    size: number // in bytes
  }
  base64?: string

  constructor ({ body, base64, ...data }: ImageChatMessageServerProps & { base64?: string }) {
    super(data)
    Object.assign(this, cloneDeep({
      body: {
        name: body.name,
        url: body.url,
        size: Number(body.size)
      }
    }))
    this.base64 = base64
  }

  static fromServer (data: ImageChatMessageServerProps) {
    return new ImageChatMessage(data)
  }

  getShortMessage () {
    return this.body.name
  }
}

export type ImageChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.IMAGE
  body: {
    name: string
    url: string | null
    size: string | number
  }
}
