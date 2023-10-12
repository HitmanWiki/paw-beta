import cloneDeep from 'lodash/cloneDeep'
import { convertToLocal } from '@/utils/date'

export default class Post {
  id: number
  name: string
  description: string
  text: string | null
  url: string
  set_title: string | null
  seo_description: string | null
  poster: string | null
  preview: string | null
  publish_at: string | null
  created_at: string | null
  updated_at: string | null
  questions: Array<PostQuestion>

  constructor (data: Partial<Post>) {
    Object.assign(this, cloneDeep({
      text: null,
      set_title: null,
      seo_description: null,
      poster: null,
      preview: null,
      publish_at: null,
      created_at: null,
      updated_at: null,
      ...data,
    }))
  }
  static fromServer (data: PostFromServer) {
    return new Post({
      ...data,
      id: +data.id,
      questions: data.relations?.Question || [],
    })
  }

  get publishAt () {
    return this.publish_at || this.created_at
  }

  get publishAtFormatted () {
    return convertToLocal(this.publishAt, 'MMM DD, YYYY')
  }
}

export type PostFromServer = {
  id: string | number
  name: string
  description: string
  text: string | null
  url: string
  set_title: string | null
  seo_description: string | null
  poster: string | null
  preview: string | null
  publish_at: string | null
  created_at: string | null
  updated_at: string | null
  relations: {
    Question: Array<PostQuestion>
  }
}

export type PostQuestion = {
  question: string,
  answer: string,
}
