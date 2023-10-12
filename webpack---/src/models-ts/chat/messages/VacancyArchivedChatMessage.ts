import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class VacancyArchivedChatMessage extends AbstractChatMessage {
  constructor (data: VacancyArchivedChatMessageServerProps) {
    super(data)
    this.body = 'This Full-time Job was closed by the customer.'
  }

  static fromServer (data: VacancyArchivedChatMessageServerProps) {
    return new VacancyArchivedChatMessage(data)
  }
}

export type VacancyArchivedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.VACANCY_ARCHIVED
}
