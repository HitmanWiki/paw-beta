import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import AbstractChatMessage, { AbstractChatMessageServerProps } from './AbstractChatMessage'

const BY_ADMIN = 'Due to a violation of our terms & conditions, this job has been removed from our platform.'
const BY_CUSTOMER = 'This Full-time Job was removed by the customer.'

export default class VacancyUnavailableChatMessage extends AbstractChatMessage {
  constructor (data: VacancyUnavailableChatMessageServerProps) {
    super(data)
    this.body = data.body.is_admin_unpublished || data.body.is_admin_removed ? BY_ADMIN : BY_CUSTOMER
  }

  static fromServer (data: VacancyUnavailableChatMessageServerProps) {
    return new VacancyUnavailableChatMessage(data)
  }
}

export type VacancyUnavailableChatMessageServerProps = AbstractChatMessageServerProps & {
  type: MessageTypes.VACANCY_UNPUBLISHED | MessageTypes.VACANCY_REMOVED
  body: {
    reason: string
    is_admin_unpublished: number
    is_admin_removed: number
  }
}
