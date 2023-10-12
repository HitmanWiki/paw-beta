import cloneDeep from 'lodash/cloneDeep'
import maxBy from 'lodash/maxBy'
import unescape from 'lodash/unescape'
import Image from '@/models/Image'
import AccountType from '@/constants-ts/user/AccountType'
import { DEFAULT_GIG_APPLICATION_MSG } from '@/constants-ts/gig/gigMessages'
import Avatar from '@/models/user/Avatar'
import Skill from '@/models-ts/Skill'
import GigOffer, { GigOfferFromServer } from './GigOffer'
import { GigOfferStages } from '@/constants-ts/gig/gigOfferStages'
import { parseSlug } from '@/utils-ts/parser'
import { getDateFromString } from '@/utils/date'
import { GigTimeTypes } from '@/constants-ts/gig/gigTimeTypes'

export default class MyGigApplication {
  id: number
  gigId: number
  deadline?: number
  comment?: string
  budget?: string
  status: number
  createdAt: Date
  customer: {
    id: number
    name: string
    avatar: Avatar
    type: AccountType
    reviewsCount: number
    avgReviews: string
  } | null
  freelancer: {
    id: number
    name: string
    avatar: Avatar
    type: AccountType
    reviewsCount: number
    avgReviews: string
  } | null
  gig: {
    id: number
    slug: string
    name: string
    timeType: GigTimeTypes
  }
  offer?: GigOffer | null

  constructor (data: Partial<MyGigApplication>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: MyGigApplicationFromServer) {
    const offer = maxBy((data.relations?.Offers || [])
      .map(offer => ({
        ...offer,
        createdDate: +(getDateFromString(offer.created_at)),
      })), 'createdDate')
    const comment = data.comment === DEFAULT_GIG_APPLICATION_MSG
      ? ''
      : data.comment
    return new MyGigApplication({
      id: data.id,
      gigId: data.gig_id,
      comment,
      deadline: data.deadline,
      budget: data.budget?.amount,
      createdAt: getDateFromString(data.created_at),
      offer: offer ? GigOffer.fromServer(offer) : null,
      customer: data.relations?.Customer ? {
        id: data.relations.Customer.id,
        name: data.relations.Customer.name,
        avatar: Avatar.fromServer(data.relations.Customer.avatar),
        type: data.relations.Customer.type,
        avgReviews: (data.relations.Customer.rating.avg_reviews || 0).toFixed(2),
        reviewsCount: data.relations.Customer.reviews_count,
      } : null,
      freelancer: data.relations?.Freelancer ? {
        id: data.relations.Freelancer.id,
        name: data.relations.Freelancer.name,
        avatar: Avatar.fromServer(data.relations.Freelancer.avatar),
        type: data.relations.Freelancer.type,
        avgReviews: (data.relations.Freelancer.rating.avg_reviews || 0).toFixed(2),
        reviewsCount: data.relations.Freelancer.reviews_count,
      } : null,
      gig: {
        id: data.relations?.Gig.id || 0,
        slug: parseSlug(data.relations?.Gig?.slug),
        name: unescape(data.relations?.Gig?.name),
        timeType: Number(data.relations?.Gig?.time_type) || GigTimeTypes.FIXED,
      }
    })
  }

  get deadlineInDays () {
    return (this.deadline || 0) / 86400
  }
}

export type MyGigApplicationFromServer = {
  id: number
  gig_id: number
  deadline?: number
  comment?: string
  budget?: {
    amount: string
  }
  created_at: string
  relations?: {
    Offers?: Array<GigOfferFromServer>
    Customer?: {
      id: number
      name: string
      type: AccountType
      avatar: {}
      rating: {
        avg_reviews: number
      }
      reviews_count: number
    }
    Freelancer?: {
      id: number
      name: string
      type: AccountType
      avatar: {}
      rating: {
        avg_reviews: number
      }
      reviews_count: number
    }
    Gig: {
      id: number
      slug: string
      name: string
      time_type: GigTimeTypes
    }
  }
}
