export enum ChatEvents {
  CONNECTED = 'connect',
  DISCONNECT = 'disconnect',
  RECEIVE_ROOMS = 'receive.rooms',
  RECEIVE_ROOM = 'receive.room',
  RECEIVE_ROOM_DETAILS = 'receive.get.room',
  RECEIVE_MESSAGES = 'receive.messages',
  RECEIVE_MESSAGE = 'receive.message',
  RECEIVE_FILE = 'receive.file',
  UPDATE_MESSAGE = 'update.message',
  UPDATE_ROOM_ENTITY = 'update.room.entity',
  UPDATE_ROOM_STAGE = 'update.room.stage',
  ROOM_ACTION = 'room.action',
  UNLOCK_ROOM = 'unlock.room',
  RECEIVE_UNREAD_MESSAGES_COUNT = 'receive.unread.messages.count.by.rooms',
}

export type EventHandlers = {
  [key in ChatEvents]?: (args: any, rawData?: any) => void
}
