import Deferred from 'promise-deferred'

export default class LoadableModel<T> {
  isLoading: boolean
  isLoaded: boolean
  value: T
  promise: Deferred.Deferred<T> | null

  constructor (data = {} as { isLoading?: boolean, isLoaded?: boolean, value: T }) {
    this.isLoading = data.hasOwnProperty('isLoading') ? Boolean(data.isLoading) : true
    this.isLoaded = data.isLoaded || false
    this.value = data.value
  }

  loaded (value: T) {
    this.value = value
    this.isLoaded = true
    this.isLoading = false
    if (this.promise) {
      this.promise.resolve(value)
    }
  }

  loading () {
    this.isLoading = true
    this.promise = new Deferred()
  }

  reject (defaultValue?: T) {
    this.isLoading = false
    this.isLoaded = false
    if (defaultValue) {
      this.value = defaultValue
    }
    if (this.promise) {
      this.promise.reject()
    }
  }
}
