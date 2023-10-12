import { GetterTree } from 'vuex'
import ChatRoom from '@/models-ts/chat/ChatRoom'
import { IChatNewState } from './types'
import { getRoom } from './helper'

export default {
  getRoomMessages: (state: IChatNewState) => {
    if (state.openedRoomId) {
      return state.messages[state.openedRoomId]?.value || []
    }
    return []
  },
  getRoomMessageLoading: (state: IChatNewState) => {
    if (state.openedRoomId) {
      return state.messages[state.openedRoomId]?.isLoading
    }
    return true
  },
  getParticipant: (state: IChatNewState) => (id: string) => state.participants[id],
  getOpenedRoom: (state: IChatNewState) => {
    if (state.openedRoomId) {
      return state.openedRooms[state.openedRoomId]
    }
  },
  getUnreadCount: (state: IChatNewState) => (id: ChatRoom['id']) => {
    return state.unreadMap[id] || 0
  },
} as GetterTree<IChatNewState, any>
