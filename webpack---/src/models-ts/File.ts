import { CAT_IMG_ORIGINAL } from '@/constants/file'
import { getUrl } from '@/utils/file'
import { parseJson } from '@/utils/parser'

export default class File {
  id: number | string
  created_at?: string
  name: string
  filename: string
  ext: string
  source: string
  path: string
  description: string
  category: string | number
  meta: any

  constructor (data: Partial<File>) {
    Object.assign(this, {
      id: data.id || '',
      created_at: data.created_at,
      name: data.name,
      filename: data.filename,
      ext: data.ext,
      source: data.source,
      path: data.path,
      description: data.description,
      category: data.category || CAT_IMG_ORIGINAL,
      meta: data.meta,
    })
  }

  static fromServer (data: FileFromServer) {
    return new File({
      ...data,
      category: data.category,
    })
  }

  get src () {
    return getUrl(this)
  }

  get parsedMeta () {
    return parseJson(this.meta)
  }
}

export type FileFromServer = {
  id: number | string
  created_at: string
  name: string
  filename: string
  ext: string
  source: string
  path: string
  description: string
  category: string
  meta: any
}
