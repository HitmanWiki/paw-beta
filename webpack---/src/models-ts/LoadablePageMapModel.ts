import { LoadablePagePagination } from './LoadablePageModel'

interface MapValues<T> { [k: string]: T }

export default class LoadablePageMapModel<T> {
  isLoading: boolean
  isLoaded: boolean
  pagination: LoadablePagePagination
  values: MapValues<T>

  constructor (data = {} as Partial<LoadablePageMapModel<T>>) {
    this.isLoading = data.hasOwnProperty('isLoading') ? Boolean(data.isLoading) : true
    this.isLoaded = data.isLoaded || false
    this.pagination = data.pagination || {
      total: 0,
      limit: 12,
      offset: 0,
    }
    this.values = data.values || {}
  }

  loaded ({ pagination, values }: { pagination: LoadablePagePagination, values: MapValues<T> }) {
    this.values = values || {}
    this.pagination = pagination
    this.isLoaded = true
    this.isLoading = false
  }

  loadMore ({ pagination, values }: { pagination: LoadablePagePagination, values: MapValues<T> }) {
    this.values = { ...this.values, ...values }
    this.pagination = { ...pagination, offset: Math.max(Object.keys(this.values).length - (pagination.limit || 0), 0) }
    this.isLoaded = true
    this.isLoading = false
  }

  loading () {
    this.isLoading = true
  }
}
