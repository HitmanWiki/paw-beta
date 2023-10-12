export type LoadablePagePagination = {
  total: number
  limit?: number
  offset?: number
}

export default class LoadablePageModel<T> {
  isLoading: boolean
  isLoaded: boolean
  pagination: LoadablePagePagination
  values: Array<T>

  constructor (data = {} as Partial<LoadablePageModel<T>>) {
    this.isLoading = data.hasOwnProperty('isLoading') ? Boolean(data.isLoading) : true
    this.isLoaded = data.isLoaded || false
    this.pagination = data.pagination || {
      total: 0,
      limit: 12,
      offset: 0,
    }
    this.values = data.values || []
  }

  loaded ({ pagination, values }: { pagination: LoadablePagePagination, values: Array<T> }) {
    this.values = values || []
    this.pagination = pagination
    this.isLoaded = true
    this.isLoading = false
  }

  loadMore ({ pagination, values }: { pagination: LoadablePagePagination, values: Array<T> }) {
    this.values = this.values.concat(values)
    this.pagination = pagination
    this.isLoaded = true
    this.isLoading = false
  }

  loading () {
    this.isLoading = true
  }
}
