import cloneDeep from 'lodash/cloneDeep'
import AccountType from '@/constants-ts/user/AccountType'
import Avatar from '@/models/user/Avatar'

type Rating = { category: number, rate: number }

export default class Review {
  createdAt: string
  id: number
  type: number
  userId: number
  userType: AccountType
  avatar: Avatar
  userName: string
  userAvgReview: string
  userAvgReputation: string
  reviewsCount: number
  text: string
  ratings: Array<Rating>

  constructor (data: Partial<Review>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (props: ReviewServerProps) {
    return new Review({
      createdAt: props.created_at,
      id: props.id,
      type: props.type,
      userId: props.from_user_id,
      userType: props.meta.from_user?.type || AccountType.USER_ACCOUNT_SIMPLE,
      userName: props.meta.from_user?.name || '',
      avatar: Avatar.fromServer(props.meta.from_user?.avatars || []),
      userAvgReview: Number(props.meta.from_user?.avg_reviews || 0).toFixed(2),
      userAvgReputation: Number(props.meta.from_user?.avg_reputation || 0).toFixed(2),
      reviewsCount: props.meta.from_user?.reviews_count || 0,
      text: props.text || '',
      ratings: props.relations.Rate || [],
    })
  }
}

export type ReviewServerProps = {
  created_at: string
  id: number
  type: number
  from_user_id: number
  text: string
  meta: {
    from_user?: {
      type: AccountType
      name: string
      avatars: {}
      avg_reviews: number
      avg_reputation: number
      reviews_count: number
    }
  }
  relations: {
    Rate?: Array<Rating>
  }
}
