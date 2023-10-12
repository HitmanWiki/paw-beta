import { Channel as ChannelTypes } from '@/constants-ts/user/channels'

export default class Channel {
  type: ChannelTypes
  value: string
  isVisible: boolean
  customerType?: number

  constructor (props: Partial<Channel>) {
    Object.assign(this, props)
  }

  static fromServer (data: ChannelFromServer) {
    return new Channel({
      ...data,
      customerType: data.customer_type,
      isVisible: Boolean(data.is_visible),
    })
  }

  toServer () {
    return {
      type: this.type,
      value: this.value.trim(),
      profile_type: this.customerType,
      is_visible: Number(this.isVisible),
    }
  }
}

export type ChannelFromServer = {
  type: Channel['type'],
  value: Channel['value'],
  is_visible: number,
  customer_type?: number,
}
