import ChatRoom, { ChatRoomServerProps } from '@/models-ts/chat/ChatRoom'
import { io, Socket } from 'socket.io-client'
import { ChatEvents, EventHandlers } from './types'
import chatMessageFactory from '@/models-ts/chat/messages/chatMessageFactory'
import { ChatMessageFromServer } from '@/models-ts/chat/messages/ChatMessageType'
import { closeRoom } from '@/api/chat'
import { RoomStages } from '@/constants-ts/chat/RoomStages'
import { RoomTypes } from '@/constants-ts/chat/RoomTypes'
import ChatRoomDetails, { ChatRoomDetailsServerProps } from '@/models-ts/chat/ChatRoomDetails'

export interface RoomFilter {
  freelancerStages?: Array<RoomStages>
  customerStages?: Array<RoomStages>
  types?: Array<RoomTypes>
  limit?: number
  offset?: number
}

class Chat {
  private authToken: string
  private socket?: Socket
  private eventPrehooks = {
    [ChatEvents.RECEIVE_MESSAGE]: this.onReceiveMessage,
    [ChatEvents.UPDATE_MESSAGE]: this.onReceiveMessage,
    [ChatEvents.RECEIVE_FILE]: this.onReceiveMessage,
    [ChatEvents.RECEIVE_MESSAGES]: this.onReceiveMessages,
    [ChatEvents.RECEIVE_ROOMS]: this.onReceiveRooms,
    [ChatEvents.RECEIVE_ROOM]: this.onReceiveRoom,
    [ChatEvents.UPDATE_ROOM_STAGE]: this.onReceiveRoom,
    [ChatEvents.RECEIVE_ROOM_DETAILS]: this.onReceiveRoomDetails,
    [ChatEvents.ROOM_ACTION]: (data: any) => this.onReceiveRoom(data.room),
    [ChatEvents.UNLOCK_ROOM]: this.onUnlockedRoom,
  }
  async init ({ token }: { token: string }, handlers: EventHandlers) {
    if (process.env.VUE_APP_CHAT_URL && token && !this.socket) {
      const initPromise = new Promise((resolve, reject) => {
        this.authToken = token
        this.socket = io(process.env.VUE_APP_CHAT_URL!, {
          transports: ['websocket'],
          auth: { token: this.authToken },
          path: process.env.VUE_APP_CHAT_PATH
        })
        this.socket.on('error', data => {
          console.error('Error', data)
        })
        this.socket.on('connect_error', (err) => {
          console.error('connect_error', err)
        })
        this.socket.once(ChatEvents.CONNECTED, () => {
          resolve('connected')
        })
      })
      for (let event of Object.values(ChatEvents)) {
        if (handlers[event]) {
          await this.socket!.on(event, (eventData: any) => {
            try {
              let data = eventData
              if (event in this.eventPrehooks) {
                // @ts-ignore
                data = this.eventPrehooks[event](eventData)
              }
              handlers[event]!(data, eventData)
            } catch (err) {
              console.error(err)
            }
          })
        }
      }
      await initPromise
    }
  }
  destroy () {
    if (this.socket) {
      for (const event of Object.values(ChatEvents)) {
        if (event === ChatEvents.DISCONNECT) {
          continue
        } else {
          this.socket.off(event)
        }
      }
      this.socket.disconnect()
      this.socket = undefined
    }
  }
  getRooms (params?: RoomFilter) {
    if (this.socket) {
      this.socket.emit('get.rooms', params)
    }
  }

  getRoom (id: string) {
    if (this.socket) {
      this.socket.emit('get.room', { id })
    }
  }

  createRoom () {
    if (this.socket) {
      this.socket.emit('create.room', {
        participant: '266:1'
      })
    }
  }

  async closeRoom (roomId: string) {
    return closeRoom(roomId)
  }

  getRoomMessages (roomId: string) {
    if (this.socket) {
      this.socket.emit('get.messages', {
        roomId: roomId
      })
    }
  }

  sendMessage ({ roomId, id, message }: { roomId: string, id: string, message: string }) {
    if (this.socket) {
      this.socket.emit('send.message', {
        roomId: roomId,
        deliveryId: id,
        body: message,
      })
    }
  }

  sendFile ({ roomId, id, file }: { roomId: string, id: string, file: File }) {
    const readFilePromise = new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () => {
        if (this.socket) {
          this.socket.emit('send.file', {
            fileName: file.name,
            deliveryId: id,
            fileData: reader.result,
            roomId,
          })
          resolve(1)
        }
      }
      reader.onerror = function (error) {
        reject(error)
      }
    })
    return readFilePromise
  }

  readMessages ({ roomId, ids }: { roomId: string, ids: Array<string> }) {
    if (this.socket) {
      this.socket.emit('read.messages', { roomId, ids })
    }
  }

  getUnreadMessagesCount () {
    if (this.socket) {
      this.socket.emit('get.unread.messages.count.by.rooms')
    }
  }

  private onUnlockedRoom (room: ChatRoomServerProps) {
    return { roomId: room.id, flag: room.isUnlocked }
  }
  private onReceiveMessage (msg: ChatMessageFromServer) {
    return chatMessageFactory(msg)
  }
  private onReceiveMessages (msgs: Array<ChatMessageFromServer>) {
    return msgs.map(chatMessageFactory)
  }
  private onReceiveRooms ({ filter, rooms, total }: { filter: RoomFilter, rooms: Array<ChatRoomServerProps>, total: number }) {
    return { filter, rooms: rooms.map(room => ChatRoom.fromServer(room)), total }
  }
  private onReceiveRoom (room: ChatRoomServerProps) {
    try {
      return ChatRoom.fromServer(room)
    } catch (e) {
      console.log(e)
    }
  }
  private onReceiveRoomDetails (room: ChatRoomDetailsServerProps) {
    try {
      return ChatRoomDetails.fromServer(room)
    } catch (e) {
      console.log(e)
    }
  }
}

export default new Chat()
