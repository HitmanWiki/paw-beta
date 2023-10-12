import uniqueId from 'lodash/uniqueId'
import IAnalyticsService from './IAnalyticsService'

type DeferredQuery = () => any

const getLoadedEventDispatcher = (id: string) => `
  let event = new CustomEvent('analyticScriptLoaded', {
    detail: { id: '${id}' }
  })
  document.dispatchEvent(event)
`

export default abstract class AbstractLazyAnalyticsService implements IAnalyticsService {
  protected client: any
  protected loading = true
  private id: string
  private deferredQueries: Array<DeferredQuery> = []
  isAvailable (): boolean {
    return process.env.VUE_APP_MODE === 'prod' && process.client
  }
  send (event: string, eventData: any) {}
  async loadScript (scriptText: string) {
    const promise = new Promise((resolve, reject) => {
      this.loading = true
      this.id = uniqueId('script_')
      document.addEventListener('analyticScriptLoaded', (e: Event) => {
        if ((<CustomEvent>e).detail?.id === this.id) {
          this.loading = false
          setTimeout(() => {
            if (this.deferredQueries.length) {
              this.deferredQueries.forEach(query => query())
            }
          }, 1000)
          resolve(true)
        }
      })
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.innerHTML = `${scriptText};${getLoadedEventDispatcher(this.id)}`
      script.async = true

      script.onerror = reject
      document.body.appendChild(script)
    })
    return promise
  }
  postponeQuery (query: DeferredQuery) {
    this.deferredQueries.push(query)
  }
}
