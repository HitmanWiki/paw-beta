import { ActionTree } from 'vuex'
import { groupBy, isEqual, pick, uniqueId } from 'lodash'
import ChatParticipant from '@/models-ts/chat/ChatParticipant'
import ChatRoomDetails from '@/models-ts/chat/ChatRoomDetails'
import ChatRoom, { ChatRoomServerProps } from '@/models-ts/chat/ChatRoom'
import FileChatMessage from '@/models-ts/chat/messages/FileChatMessage'
import ImageChatMessage from '@/models-ts/chat/messages/ImageChatMessage'
import TextChatMessage from '@/models-ts/chat/messages/TextChatMessage'
import chatService, { RoomFilter } from '@/servicies-ts/Chat/Chat'
import { ChatEvents } from '@/servicies-ts/Chat/types'
import { ChatMessage } from '@/models-ts/chat/messages/ChatMessageType'
import { MessageTypes } from '@/constants-ts/chat/MessageTypes'
import { Roles } from '@/constants-ts/user/roles'
import { RoomStages } from '@/constants-ts/chat/RoomStages'
import { RoomTypes } from '@/constants-ts/chat/RoomTypes'
import { convertToUTC } from '@/utils/date'
import { isImage, readImage } from '@/utils/file'
import { IChatNewState, UnreadMap } from './types'
import { getRoom } from './helper'

const LIMIT_ROOMS = 10
const field = (isCustomer: boolean) => isCustomer ? 'customerStages' : 'freelancerStages'
const notArchivedStages = [RoomStages.NEW, RoomStages.IN_PROGRESS, RoomStages.IN_DISPUTE, RoomStages.WAIT_FOR_REVIEW]
const FREELANCE_ROOMS_FILTER = (isCustomer: boolean): RoomFilter => ({
  [field(isCustomer)]: notArchivedStages,
  types: [RoomTypes.GIG, RoomTypes.JOB],
})
const VACANCIES_ROOMS_FILTER = (isCustomer: boolean): RoomFilter => ({
  [field(isCustomer)]: notArchivedStages,
  types: [RoomTypes.VACANCY],
})
const ARCHIVED_ROOMS_FILTER = (isCustomer: boolean): RoomFilter => ({ [field(isCustomer)]: [RoomStages.ARCHIVED] })
const arrayToMap = (rooms: Array<ChatRoom>) => rooms.reduce((map, room) => ({ ...map, [room.id]: room }), {})

export default {
  async init ({ rootState, commit, dispatch }) {
    await chatService.init(
      { token: rootState.user.accessToken as string },
      {
        [ChatEvents.CONNECTED]: () => {
          console.log('connected')
          setTimeout(() => { // doesn't work without delay
            commit('setConnected', true)
            commit('setInitialized', true)
          }, 2000)
        },
        [ChatEvents.DISCONNECT]: (reason) => {
          console.log('disconntected', reason, new Date())
          commit('setConnected', false)
        },
        [ChatEvents.RECEIVE_ROOMS]: response => dispatch('onReceiveRooms', response),
        [ChatEvents.RECEIVE_ROOM]: room => dispatch('onReceiveRoom', room),
        [ChatEvents.RECEIVE_ROOM_DETAILS]: room => dispatch('onReceiveRoomDetails', room),
        [ChatEvents.RECEIVE_MESSAGES]: messages => dispatch('onReceiveMessages', messages),
        [ChatEvents.RECEIVE_MESSAGE]: (message, rawData) => dispatch('onReceiveMessage', { message, rawData }),
        [ChatEvents.RECEIVE_FILE]: (message, rawData) => dispatch('onReceiveMessage', { message, rawData }),
        [ChatEvents.UPDATE_MESSAGE]: message => dispatch('onUpdateMessage', message),
        [ChatEvents.ROOM_ACTION]: room => dispatch('onUpdateRoom', room),
        [ChatEvents.UNLOCK_ROOM]: room => dispatch('onUnlockRoom', room),
        [ChatEvents.RECEIVE_UNREAD_MESSAGES_COUNT]: msg => dispatch('onReceiveUnreadMessagesCount', msg)
      }
    )
  },
  destroy ({ commit }) {
    commit('setInitialized', false)
    commit('setConnected', false)
    chatService.destroy()
  },
  initRooms ({ commit, rootGetters }) {
    const activeRole = rootGetters['user/activeProfile']
    if (activeRole) {
      commit('setFreelanceRoomsLoading')
      commit('setVacanciesRoomsLoading')
      commit('setArchivedRoomsLoading')
      const isCustomer = activeRole === Roles.CUSTOMER
      chatService.getRooms({ ...FREELANCE_ROOMS_FILTER(isCustomer), limit: LIMIT_ROOMS, offset: 0 })
      chatService.getRooms({ ...VACANCIES_ROOMS_FILTER(isCustomer), limit: LIMIT_ROOMS, offset: 0 })
      chatService.getRooms({ ...ARCHIVED_ROOMS_FILTER(isCustomer), limit: LIMIT_ROOMS, offset: 0 })
    }
  },
  async loadMoreFreelanceRooms (
    { rootGetters, commit },
    { limit = LIMIT_ROOMS, offset = 0 }
  ) {
    commit('setFreelanceRoomsLoading')
    const activeRole = rootGetters['user/activeProfile']
    if (activeRole) {
      const isCustomer = activeRole === Roles.CUSTOMER
      chatService.getRooms({ ...FREELANCE_ROOMS_FILTER(isCustomer), limit, offset })
    }
  },
  async loadMoreVacanciesRooms (
    { rootGetters, commit },
    { limit = LIMIT_ROOMS, offset = 0 }
  ) {
    commit('setVacanciesRoomsLoading')
    const activeRole = rootGetters['user/activeProfile']
    if (activeRole) {
      const isCustomer = activeRole === Roles.CUSTOMER
      chatService.getRooms({ ...VACANCIES_ROOMS_FILTER(isCustomer), limit, offset })
    }
  },
  async loadMoreArchivedRooms (
    { rootGetters, commit },
    { limit = LIMIT_ROOMS, offset = 0 }
  ) {
    commit('setArchivedRoomsLoading')
    const activeRole = rootGetters['user/activeProfile']
    if (activeRole) {
      const isCustomer = activeRole === Roles.CUSTOMER
      chatService.getRooms({ ...ARCHIVED_ROOMS_FILTER(isCustomer), limit, offset })
    }
  },
  getUnreadMessagesCount () {
    chatService.getUnreadMessagesCount()
  },
  onReceiveUnreadMessagesCount ({ commit }, unreadMap: UnreadMap) {
    commit('setUnreadMap', unreadMap)
  },
  onReceiveRooms (
    { commit, rootGetters },
    { filter, rooms, total }: { filter: RoomFilter, rooms: Array<ChatRoom>, total: number }
  ) {
    const participants = rooms.reduce((res, room) => {
      room.participants.forEach(user => {
        res[user.id] = user
      })
      return res
    }, {} as IChatNewState['participants'])
    Object.values(participants).forEach(user => commit('addParticipant', user))

    const isCustomer = rootGetters['user/activeProfile'] === Roles.CUSTOMER
    const filterStage = field(isCustomer)
    const comparableFilter = pick(filter, [filterStage, 'types'])
    if (isEqual(comparableFilter, FREELANCE_ROOMS_FILTER(isCustomer))) {
      commit('setFreelanceRoomsLoaded', {
        pagination: { total, limit: filter.limit, offset: filter.offset },
        values: arrayToMap(rooms),
      })
    } else if (isEqual(comparableFilter, VACANCIES_ROOMS_FILTER(isCustomer))) {
      commit('setVacanciesRoomsLoaded', {
        pagination: { total, limit: filter.limit, offset: filter.offset },
        values: arrayToMap(rooms),
      })
    } else if (isEqual(comparableFilter, ARCHIVED_ROOMS_FILTER(isCustomer))) {
      commit('setArchivedRoomsLoaded', {
        pagination: { total, limit: filter.limit, offset: filter.offset },
        values: arrayToMap(rooms),
      })
    }
  },
  onUpdateRoom ({ commit, rootGetters }, room: ChatRoom) {
    const isCustomer = rootGetters['user/activeProfile'] === Roles.CUSTOMER
    const stage = isCustomer ? room.customerStage : room.freelancerStage
    const isArchived = stage === RoomStages.ARCHIVED
    const isVacancy = room.type === RoomTypes.VACANCY
    if (isArchived) {
      commit('setRoom', { roomId: room.id, room, roomStorage: 'archivedRooms' })
      if (isVacancy) {
        commit('setRoom', { roomId: room.id, room: null, roomStorage: 'vacanciesRooms' })
      } else {
        commit('setRoom', { roomId: room.id, room: null, roomStorage: 'freelanceRooms' })
      }
    } else {
      if (isVacancy) {
        commit('setRoom', { roomId: room.id, room, roomStorage: 'vacanciesRooms' })
      } else {
        commit('setRoom', { roomId: room.id, room, roomStorage: 'freelanceRooms' })
      }
    }
  },
  onUnlockRoom ({ commit }, { roomId, flag }: { roomId: string, flag: boolean }) {
    commit('setRoomUnlocked', { roomId, flag })
  },
  onReceiveRoom ({ commit, rootGetters }, room: ChatRoom) {
    room.participants.forEach(user => commit('addParticipant', user))
    // if (state.openedRoomId) {
    //   const openedRoom = state.rooms.value.find(r => r.id === state.openedRoomId)
    //   if (openedRoom && openedRoom.temporary) {
    //     commit('replaceRoom', { id: state.openedRoomId, room })
    //     commit('setOpenedRoomId', room.id)
    //     dispatch('openRoom', room.id)
    //     return
    //   }
    // }
    const isCustomer = rootGetters['user/activeProfile'] === Roles.CUSTOMER
    const stage = isCustomer ? room.customerStage : room.freelancerStage
    const isArchived = stage === RoomStages.ARCHIVED
    const isVacancy = room.type === RoomTypes.VACANCY
    if (isArchived) {
      commit('setRoom', { roomId: room.id, room, roomStorage: 'archivedRooms' })
    } else if (isVacancy) {
      commit('setRoom', { roomId: room.id, room, roomStorage: 'vacanciesRooms' })
    } else {
      commit('setRoom', { roomId: room.id, room, roomStorage: 'freelanceRooms' })
    }
  },
  onReceiveRoomDetails ({ commit }, room: ChatRoomDetails) {
    room.participants.forEach(user => commit('addParticipant', user))
    commit('setOpenedRoom', { roomId: room.id, room })
  },
  onReceiveMessages ({ state, commit }, messages: Array<ChatMessage>) {
    const messagesByRoom = groupBy(messages, 'roomId')
    if (state.openedRoomId) {
      if (messagesByRoom[state.openedRoomId]?.length) {
        for (const message of messagesByRoom[state.openedRoomId]) {
          commit('setRoomMessage', { roomId: state.openedRoomId, message })
        }
      } else {
        commit('setRoomMessage', { roomId: state.openedRoomId })
      }
    }
  },
  onReceiveMessage (
    { rootState, state, commit, dispatch },
    { message, rawData }: { message: ChatMessage, rawData: { room: ChatRoomServerProps } }
  ) {
    if (state.openedRoomId && message.roomId === state.openedRoomId) {
      commit('setRoomMessage', { roomId: state.openedRoomId, message })
    }
    const room = getRoom(state, message.roomId)
    if (room) {
      commit('setLastMessage', { roomId: room.id, message })
      let chatUserId = `${rootState.user.id}:${rootState.user.activeRole}`
      if (!message.readers.find(reader => reader.readerId === chatUserId)) {
        commit('setRoomUnreadCount', { roomId: room.id, count: state.unreadMap[room.id] + 1 })
      }
    } else {
      const newRoom = ChatRoom.fromServer(rawData.room, message)
      const unreadCount = state.unreadMap[newRoom.id] || 1
      newRoom.unreadCount = unreadCount
      dispatch('onReceiveRoom', newRoom)
    }
  },
  onUpdateMessage ({ state, commit }, message: ChatMessage) {
    if (state.openedRoomId && message.roomId === state.openedRoomId) {
      commit('setRoomMessage', { roomId: state.openedRoomId, message })
    }
  },
  sendMessage (
    { commit, rootState },
    { message, roomId }: { message: string, roomId: string }
  ) {
    const userId = ChatParticipant.toSenderId(rootState.user.id, rootState.user.activeRole)
    const id = uniqueId('msg_')
    const messageModel = new TextChatMessage({
      _id: id,
      deliveryId: id,
      type: MessageTypes.TEXT,
      updatedAt: convertToUTC(new Date()),
      roomId,
      body: message,
      sender: { id: userId },
      sending: true,
      readers: [],
      isSystem: false,
    })
    commit('addMessage', { roomId, message: messageModel })
    chatService.sendMessage({ message, roomId, id })
  },
  async sendFile ({ commit, rootState }, { file, roomId }: { file: File, roomId: string}) {
    const userId = ChatParticipant.toSenderId(rootState.user.id, rootState.user.activeRole)
    const id = uniqueId('msg_')
    let messageModel
    chatService.sendFile({ file, id, roomId })
    if (isImage(file)) {
      const { base64 } = await readImage(file, null)
      messageModel = new ImageChatMessage({
        _id: id,
        deliveryId: id,
        type: MessageTypes.IMAGE,
        updatedAt: convertToUTC(new Date()),
        roomId,
        body: {
          name: file.name,
          url: null,
          size: file.size,
        },
        sender: { id: userId },
        sending: true,
        base64,
        readers: [],
        isSystem: false,
      })
    } else {
      messageModel = new FileChatMessage({
        _id: id,
        deliveryId: id,
        type: MessageTypes.FILE,
        updatedAt: convertToUTC(new Date()),
        roomId,
        body: {
          name: file.name,
          description: file.name,
          url: null,
          size: file.size,
        },
        sender: { id: userId },
        sending: true,
        readers: [],
        isSystem: false,
      })
    }
    commit('addMessage', { roomId, message: messageModel })
  },
  // createRoom ({ commit }: { commit: Commit }, room: ChatRoom) {
  //   commit('setRoom', room)
  //   return room
  // },
  openRoom ({ commit }, roomId: string) {
    commit('setOpenedRoomId', roomId)
    if (!roomId.startsWith('tmp_')) {
      commit('setRoomMessagesLoading', roomId)
      chatService.getRoom(roomId)
      chatService.getRoomMessages(roomId)
    }
  },
  readMessages ({ commit }, { roomId, ids, ownId }: { roomId: string, ids: Array<string>, ownId: string }) {
    chatService.readMessages({ roomId, ids })
    commit('readMessages', { roomId, ids, ownId })
  },
  async closeRoom ({ commit }, roomId: string) {
    commit('setOpenedRoomId', null)
    // await chatService.closeRoom(roomId)
  },

} as ActionTree<IChatNewState, any>
