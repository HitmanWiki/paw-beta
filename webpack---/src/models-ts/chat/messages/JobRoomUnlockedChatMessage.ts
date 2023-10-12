import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class JobRoomUnlockedChatMessage extends AbstractChatMessage {
  type = MessageTypes.JOB_ROOM_UNLOCKED
  body: string = ''

  constructor (data: JobRoomUnlockedChatMessageServerProps) {
    super(data)
    // eslint-disable-next-line max-len
    this.body = 'Based on our discussion, I’m happy to utilise your services for this Job! Simply send through your offer and I will accept it so work can begin.'
  }

  static fromServer (data: JobRoomUnlockedChatMessageServerProps) {
    return new JobRoomUnlockedChatMessage(data)
  }

  getShortMessage () {
    return this.body
  }
}

export type JobRoomUnlockedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.JOB_ROOM_UNLOCKED
  body: string
}
