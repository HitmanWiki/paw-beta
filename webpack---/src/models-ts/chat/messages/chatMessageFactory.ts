import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import ApplicationChatMessage, { ApplicationChatMessageServerProps } from './ApplicationChatMessage'
import { ChatMessageFromServer } from './ChatMessageType'
import GigDisputeChatMessage from './GigDisputeChatMessage'
import FileChatMessage from './FileChatMessage'
import GigOfferChatMessage from './GigOfferChatMessage'
import GigReviewChatMessage from './GigReviewChatMessage'
import ImageChatMessage from './ImageChatMessage'
import RoomClosedChatMessage from './RoomClosedChatMessage'
import SystemChatMessage from './SystemMessage'
import TextChatMessage, { TextChatMessageServerProps } from './TextChatMessage'
import GigRefundedChatMessage from './GigRefundedChatMessage'
import UserBannedChatMessage from './UserBannedChatMessage'
import GigMarkedDoneChatMessage from './GigMarkedDoneChatMessage'
import JobOfferChatMessage from './JobOfferChatMessage'
import JobMarkedDoneChatMessage from './JobMarkedDoneChatMessage'
import JobDisputeChatMessage from './JobDisputeChatMessage'
import JobRefundedChatMessage from './JobRefundedChatMessag'
import JobReviewChatMessage from './JobReviewChatMessage'
import JobUnavailableChatMessage from './JobUnavailableChatMessage'
import JobRoomUnlockedChatMessage from './JobRoomUnlockedChatMessage'
import VacancyApplicationAppliedChatMessage from './VacancyApplicationAppliedChatMessage'
import VacancyApplicationDeclinedChatMessage from './VacancyApplicationDeclinedChatMessage'
import VacancyRemovedChatMessage from './VacancyRemovedChatMessage'
import VacancyUnavailableChatMessage from './VacancyUnavailableChatMessage'
import VacancyArchivedChatMessage from './VacancyArchivedChatMessage'

export default function chatMessageFactory (message: ChatMessageFromServer) {
  switch (message?.type) {
    case MessageTypes.TEXT: return typeof message.body === 'object'
      ? ApplicationChatMessage.fromServer(message as ApplicationChatMessageServerProps)
      : TextChatMessage.fromServer(message as TextChatMessageServerProps)
    case MessageTypes.LINK: return TextChatMessage.fromServer(message)
    case MessageTypes.IMAGE: return ImageChatMessage.fromServer(message)
    case MessageTypes.FILE: return FileChatMessage.fromServer(message)
    case MessageTypes.JOB_OFFER: return JobOfferChatMessage.fromServer(message)
    case MessageTypes.GIG_OFFER: return GigOfferChatMessage.fromServer(message)
    case MessageTypes.ROOM_CLOSED: return RoomClosedChatMessage.fromServer(message)
    case MessageTypes.GIG_DISPUTE: return GigDisputeChatMessage.fromServer(message)
    case MessageTypes.GIG_REVIEW: return GigReviewChatMessage.fromServer(message)
    case MessageTypes.GIG_REFUNDED: return GigRefundedChatMessage.fromServer(message)
    case MessageTypes.USER_BAN: return UserBannedChatMessage.fromServer(message)
    case MessageTypes.GIG_MARK_IS_DONE: return GigMarkedDoneChatMessage.fromServer(message)
    case MessageTypes.JOB_MARK_IS_DONE: return JobMarkedDoneChatMessage.fromServer(message)
    case MessageTypes.JOB_DISPUTE: return JobDisputeChatMessage.fromServer(message)
    case MessageTypes.JOB_REFUNDED: return JobRefundedChatMessage.fromServer(message)
    case MessageTypes.JOB_REVIEW: return JobReviewChatMessage.fromServer(message)
    case MessageTypes.JOB_REMOVED:
    case MessageTypes.JOB_UNPUBLISHED: return JobUnavailableChatMessage.fromServer(message)
    case MessageTypes.JOB_ROOM_UNLOCKED: return JobRoomUnlockedChatMessage.fromServer(message)
    case MessageTypes.VACANCY_REMOVED:
    case MessageTypes.VACANCY_UNPUBLISHED: return VacancyUnavailableChatMessage.fromServer(message)
    case MessageTypes.VACANCY_APPLICATION_APPLIED: return VacancyApplicationAppliedChatMessage.fromServer(message)
    case MessageTypes.VACANCY_APPLICATION_DECLINED_BY_CUSTOMER:
    case MessageTypes.VACANCY_APPLICATION_DECLINED_BY_FREELANCER: return VacancyApplicationDeclinedChatMessage.fromServer(message)
    case MessageTypes.VACANCY_ARCHIVED: return VacancyArchivedChatMessage.fromServer(message)
    default: return SystemChatMessage.fromServer(message)
  }
}
