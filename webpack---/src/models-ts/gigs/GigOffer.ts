import cloneDeep from 'lodash/cloneDeep'
import { convertToLocal } from '@/utils/date'
import { GigOfferStages } from '@/constants-ts/gig/gigOfferStages'
import { GigTimeTypes } from '@/constants-ts/gig/gigTimeTypes'

export default class GigOffer {
  id: number
  createdAt: Date
  deadline: number
  budget: string
  stage: GigOfferStages
  freelancerId: number
  customerId: number
  timeType: GigTimeTypes
  timeValue: number
  freelancerWallet: string

  constructor (data: Partial<GigOffer>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: GigOfferFromServer) {
    return new GigOffer({
      id: data.id,
      createdAt: new Date(convertToLocal(data.created_at)),
      deadline: data.deadline,
      budget: data.rate,
      stage: data.stage,
      freelancerId: data.freelancer_id,
      customerId: data.customer_id,
      timeType: data.time_type,
      timeValue: data.time_value,
      freelancerWallet: data.freelancer_wallet,
    })
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }
}

export type GigOfferFromServer = {
  id: number
  created_at: Date
  deadline: number
  rate: string
  time_type: GigTimeTypes
  time_value: number
  stage: GigOfferStages
  freelancer_id: number
  customer_id: number
  freelancer_wallet: string
}
