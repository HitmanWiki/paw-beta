import { BACKEND_PRIVATE, BACKEND_PUBLIC } from './base'

export enum SubscriptionType {
  FREELANCER_SUBSCRIBE_REQUEST = 1,
  CUSTOMER_SUBSCRIBE_REQUEST = 2
}

interface SubscribeRequest {
  type: SubscriptionType
  email: string
  phone?: string
  name?: string
}

export function createSubscription (payload: SubscribeRequest) {
  return BACKEND_PUBLIC.post('/subscription-requests/create', { payload })
}
