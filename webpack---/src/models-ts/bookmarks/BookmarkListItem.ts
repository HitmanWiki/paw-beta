import { BookmarkTypes } from '@/constants-ts/bookmarks/bookmarkType'
import VacancyListItem, { VacancyListItemFromServer } from '@/models-ts/vacancies/VacancyListItem'
import JobListItem, { JobListItemServerProps } from '@/models-ts/job/JobListItem'
import GigListItem, { GigListItemServerProps } from '@/models-ts/gigs/GigListItem'
// import MyGigListItem, { MyGigListItemServerProps } from '@/models-ts/gigs/MyGigListItem'

export default class BookmarkListItem {
  id: number | string
  type: number | string
  entityId: number | string
  relations: {
    Vacancy: VacancyListItem | null
    Job: JobListItem | null
    Gig: GigListItem | null
  }

  constructor ({
    id,
    type,
    entityId,
    relations,
  }: Partial<BookmarkListItem>) {
    Object.assign(this, { id, type, entityId, relations })
  }

  static fromServer (props: BookmarkListItemFromServer) {
    const entityId = BookmarkListItem.getEntityId(props)
    return new BookmarkListItem({
      ...props,
      entityId,
      relations: {
        Vacancy: props.relations?.Vacancy
          ? VacancyListItem.fromServer(props.relations.Vacancy)
          : null,
        Job: props.relations?.Job
          ? JobListItem.fromServer(props.relations.Job)
          : null,
        Gig: props.relations?.Gig
          ? GigListItem.fromServer(props.relations.Gig)
          : null,
      }
    })
  }

  static getEntityId (props: BookmarkListItemFromServer) {
    switch (props.type) {
      case BookmarkTypes.VACANCY:
        return props.vacancy_id
      case BookmarkTypes.JOB:
        return props.job_id
      case BookmarkTypes.GIG:
        return props.gig_id
    }
  }
}

export type BookmarkListItemFromServer = {
  id: number | string
  type: number | string
  gig_id: number | string
  job_id: number | string
  vacancy_id: number | string
  relations: {
    Vacancy: VacancyListItemFromServer
    Job: JobListItemServerProps
    Gig: GigListItemServerProps
  }
}
