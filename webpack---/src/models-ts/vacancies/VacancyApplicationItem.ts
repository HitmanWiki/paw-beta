import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { VacancyApplicationStatuses } from '@/constants-ts/vacancies/vacancyApplicationStatuses'
import Avatar from '@/models/user/Avatar'
import cloneDeep from 'lodash/cloneDeep'
import File, { FileFromServer } from '@/models-ts/File'

type ApplicationUser = {
  id: number
  name: string
  type: AccountTypes
  avatar: Avatar
  reviewsCount: number
  avgReviews: string
}

export default class VacancyApplicationItem {
  id: number
  isRead: boolean
  freelancer: ApplicationUser
  status: VacancyApplicationStatuses
  comment: string
  cvFile?: File
  vacancyId: number

  constructor (data: Partial<VacancyApplicationItem>) {
    Object.assign(this, cloneDeep(data))
  }

  static fromServer (data: VacancyApplicationFromServer) {
    const freelancer = data.relations.Freelancer
    const files = data.relations.File || []
    let cvFile
    if (files.length) {
      cvFile = File.fromServer(files[0])
    }
    return new VacancyApplicationItem({
      id: data.id,
      isRead: Boolean(data.is_read),
      status: data.status,
      comment: data.comment,
      cvFile,
      vacancyId: data.vacancy_id,
      freelancer: {
        id: freelancer.id,
        name: freelancer.name,
        avatar: Avatar.fromServer(freelancer.avatar),
        type: freelancer.type,
        avgReviews: (freelancer.rating.avg_reviews || 0).toFixed(2),
        reviewsCount: freelancer.reviews_count,
      },
    })
  }

  get isActive () {
    return [VacancyApplicationStatuses.NEW, VacancyApplicationStatuses.IN_PROGRESS].includes(this.status)
  }
}

export type VacancyApplicationFromServer = {
  id: number
  is_read: number
  status: VacancyApplicationStatuses
  comment: string,
  vacancy_id: number
  relations: {
    File: Array<FileFromServer>
    Freelancer: {
      id: number
      name: string
      type: AccountTypes
      avatar: {}
      rating: {
        avg_reviews: number
      }
      reviews_count: number
    }
  }
}
