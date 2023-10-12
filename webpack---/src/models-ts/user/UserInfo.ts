import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { Avatar } from '@/models/user'

export default class UserInfo {
  id: number
  name: string
  type: AccountTypes
  avatar: Avatar
  reviewsCount: number
  avgReviews: string

  constructor (data: UserInfo) {
    Object.assign(this, data)
  }

  static fromServer (data: UserInfoFromServer) {
    return new UserInfo({
      id: data.id,
      name: data.name,
      avatar: Avatar.fromServer(data.avatar),
      type: data.type,
      avgReviews: (data.rating.avg_reviews || 0).toFixed(2),
      reviewsCount: data.reviews_count,
    })
  }
}

export type UserInfoFromServer = {
  id: number
  name: string
  type: AccountTypes
  avatar: {}
  rating: {
    avg_reviews: number
  }
  reviews_count: number
}
