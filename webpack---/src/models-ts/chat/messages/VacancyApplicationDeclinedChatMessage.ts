import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

export default class VacancyApplicationDeclinedChatMessage extends AbstractChatMessage {
  constructor (data: VacancyApplicationDeclinedChatMessageServerProps) {
    super(data)
    this.body = data.body
  }

  static fromServer (data: VacancyApplicationDeclinedChatMessageServerProps) {
    return new VacancyApplicationDeclinedChatMessage(data)
  }

  getShortMessage () {
    return 'The application for this Full-time Job has been declined.'
  }
}

export type VacancyApplicationDeclinedChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.VACANCY_APPLICATION_DECLINED_BY_CUSTOMER | MessageTypes.VACANCY_APPLICATION_DECLINED_BY_FREELANCER
  body: {
    reason: string
  }
}
