import ChatRoom from '@/models-ts/chat/ChatRoom'
import { IChatNewState } from './types'
import LoadablePageMapModel from '@/models-ts/LoadablePageMapModel'

export const getInitialState = (): IChatNewState => ({
  connected: false,
  initialized: false,
  freelanceRooms: new LoadablePageMapModel(),
  vacanciesRooms: new LoadablePageMapModel(),
  archivedRooms: new LoadablePageMapModel(),
  messages: {},
  openedRoomId: null,
  openedRooms: {},
  participants: {},
  unreadMap: {},
  acceptingOffer: null,
  decliningOffer: null,
  depositingOffer: null,
})

export const ROOM_STORAGE = ['freelanceRooms', 'vacanciesRooms', 'archivedRooms'] as const

export function getRoom (state: IChatNewState, roomId: ChatRoom['id']) {
  for (let roomStorage of ROOM_STORAGE) {
    const room = state[roomStorage].values[roomId]
    if (room) {
      return room
    }
  }
}
