import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class VacancyApplicationAppliedChatMessage extends AbstractChatMessage {
  type = MessageTypes.VACANCY_APPLICATION_APPLIED

  constructor (data: VacancyApplicationAppliedChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: VacancyApplicationAppliedChatMessageServerProps) {
    return new VacancyApplicationAppliedChatMessage(data)
  }

  getShortMessage () {
    return 'This position is no longer available.'
  }
}

export type VacancyApplicationAppliedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.VACANCY_APPLICATION_APPLIED
  body: {
    reason: string
  }
}
