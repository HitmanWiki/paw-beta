import Vue from 'vue'
import { MutationTree } from 'vuex'
import ChatParticipant from '@/models-ts/chat/ChatParticipant'
import ChatRoom from '@/models-ts/chat/ChatRoom'
import ChatRoomDetails from '@/models-ts/chat/ChatRoomDetails'
import LoadableModel from '@/models-ts/LoadableModel'
import { ChatMessage } from '@/models-ts/chat/messages/ChatMessageType'
import { LoadablePagePagination } from '@/models-ts/LoadablePageModel'
import { IChatNewState, RoomMap, UnreadMap } from './types'
import { ROOM_STORAGE, getInitialState, getRoom } from './helper'

export default {
  resetState (state: IChatNewState) {
    Object.assign(state, getInitialState())
  },
  setInitialized (state: IChatNewState, flag: boolean) {
    state.initialized = flag
  },
  setConnected (state: IChatNewState, flag: boolean) {
    state.connected = flag
  },
  setFreelanceRoomsLoading (state: IChatNewState) {
    state.freelanceRooms.loading()
  },
  setFreelanceRoomsLoaded (
    state: IChatNewState,
    data: { pagination: LoadablePagePagination, values: RoomMap }
  ) {
    state.freelanceRooms.loadMore(data)
  },
  setVacanciesRoomsLoading (state: IChatNewState) {
    state.vacanciesRooms.loading()
  },
  setVacanciesRoomsLoaded (
    state: IChatNewState,
    data: { pagination: LoadablePagePagination, values: RoomMap }
  ) {
    state.vacanciesRooms.loadMore(data)
  },
  setArchivedRoomsLoading (state: IChatNewState) {
    state.archivedRooms.loading()
  },
  setArchivedRoomsLoaded (
    state: IChatNewState,
    data: { pagination: LoadablePagePagination, values: RoomMap }
  ) {
    state.archivedRooms.loadMore(data)
  },
  setRoomMessagesLoading (state: IChatNewState, roomId: string) {
    if (state.messages[roomId]) {
      state.messages[roomId].loading()
    } else {
      Vue.set(state.messages, roomId, new LoadableModel<Array<ChatMessage>>({ value: [] }))
    }
  },
  addMessage (state: IChatNewState, { roomId, message }: { roomId: string, message: ChatMessage }) {
    if (state.messages[roomId]) {
      state.messages[roomId].value.push(message)
    }
  },
  setRoomMessage (state: IChatNewState, { roomId, message }: { roomId: string, message: ChatMessage }) {
    if (state.messages[roomId]) {
      if (message) {
        const messages = state.messages[roomId]?.value
        if (!messages.length) {
          messages.push(message)
        } else {
          const index = messages.findIndex(msg => msg.id === message.id || (msg.sending && msg.deliveryId === message.deliveryId))
          if (index !== -1) {
            messages.splice(index, 1, message)
          } else {
            messages.push(message)
          }
        }
      }
      state.messages[roomId].isLoaded = true
      state.messages[roomId].isLoading = false
    }
  },
  setOpenedRoomId (state: IChatNewState, roomId: string | null) {
    state.openedRoomId = roomId
  },
  setOpenedRoom (state: IChatNewState, { roomId, room }: { roomId: string, room: ChatRoomDetails }) {
    Vue.set(state.openedRooms, roomId, room)
  },
  addParticipant (state: IChatNewState, participant: ChatParticipant) {
    if (!state.participants[participant.id]) {
      Vue.set(state.participants, participant.id, participant)
    }
  },
  setRoom (
    state: IChatNewState,
    { roomId, room, roomStorage }
    : { roomStorage: typeof ROOM_STORAGE[number], roomId: ChatRoom['id'], room?: ChatRoom }
  ) {
    if (room) {
      if (state[roomStorage].values[roomId]) {
        state[roomStorage].values[roomId] = room
      } else {
        const pagination = state[roomStorage].pagination
        state[roomStorage].loadMore({
          pagination: {
            total: pagination.total + 1,
            limit: pagination.limit,
            offset: (pagination.offset || 0) + 1,
          },
          values: { [roomId]: room }
        })
      }
      Vue.set(state.unreadMap, roomId, room.unreadCount)
      if (state.openedRooms[roomId]) {
        Vue.set(state.openedRooms, roomId, room)
      }
    } else if (state[roomStorage].values[roomId]) {
      Vue.delete(state[roomStorage].values, roomId)
      const pagination = state[roomStorage].pagination
      state[roomStorage].pagination = {
        total: pagination.total - 1,
        limit: pagination.limit,
        offset: Math.max(pagination.offset || 0 - 1, 0),
      }
      Vue.delete(state.unreadMap, roomId)
    }
  },
  setRoomUnlocked (state: IChatNewState, { roomId, flag }: { roomId: string, flag: boolean }) {
    const room = getRoom(state, roomId)
    if (room) {
      room.isUnlocked = flag
    }
    if (state.openedRooms[roomId]) {
      state.openedRooms[roomId].isUnlocked = flag
    }
  },
  // replaceRoom (state: IChatNewState, { id, room }: { id: string, room: ChatRoom }) {
  //   const i = state.rooms.value.findIndex(r => r.id === id)
  //   if (i !== -1) {
  //     state.rooms.value.splice(i, 1, room)
  //   }
  // },
  readMessages (state: IChatNewState, { roomId, ids, ownId }: { roomId: string, ids: Array<string>, ownId: string }) {
    let readCount = 0
    if (state.messages[roomId]) {
      state.messages[roomId].value.forEach(msg => {
        if (ids.includes(msg.id)) {
          msg.readers.push({ readerId: ownId })
          readCount++
        }
      })
    }
    const room = getRoom(state, roomId)
    if (room) {
      room.unreadCount = Math.max(room.unreadCount - readCount, 0)
    }
    Vue.set(state.unreadMap, roomId, Math.max((state.unreadMap[roomId] || 1) - readCount, 0))
  },
  setRoomUnreadCount (state: IChatNewState, { roomId, count }: { roomId: string, count: number }) {
    const room = getRoom(state, roomId)
    if (room) {
      room.unreadCount = count
    }
    Vue.set(state.unreadMap, roomId, count)
  },
  setLastMessage (state: IChatNewState, { roomId, message }: { roomId: string, message: ChatMessage }) {
    const room = getRoom(state, roomId)
    if (room) {
      room.lastMessage = message
      room.lastMessageAt = message.updatedAt
    }
  },
  setUnreadMap (state: IChatNewState, map: UnreadMap) {
    state.unreadMap = map
  },
  setAcceptingOffer (state: IChatNewState, offer: number | null) {
    state.acceptingOffer = offer
  },
  setDecliningOffer (state: IChatNewState, offer: number | null) {
    state.decliningOffer = offer
  },
  setDepositingOffer (state: IChatNewState, offer: number | null) {
    state.depositingOffer = offer
  },
} as MutationTree<IChatNewState>
