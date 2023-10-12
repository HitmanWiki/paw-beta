import { BookmarkTypes } from '@/constants-ts/bookmarks/bookmarkType'

export default class Bookmark {
  id: number | string
  type: number | string
  entityId: number | string

  constructor ({
    id,
    type,
    entityId,
  }: Partial<Bookmark>) {
    Object.assign(this, { id, type, entityId })
  }

  static fromServer (props: BookmarkFromServer) {
    const entityId = Bookmark.getEntityId(props)
    return new Bookmark({
      ...props,
      entityId,
    })
  }

  static getEntityId (props: BookmarkFromServer) {
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

export type BookmarkFromServer = {
  id: number | string
  type: number | string
  gig_id: number | string
  job_id: number | string
  vacancy_id: number | string
}
