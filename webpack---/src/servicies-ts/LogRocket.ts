import LogrocketFuzzySanitizer from 'logrocket-fuzzy-search-sanitizer'

const privateFieldNames = [
  'Authorization',
  'token',
  'email',
  'login',
  'password',
  'confirm_password',
  'key',
]

class LogRocket {
  private appVersion
  private appID
  private isInited = false
  private client: any

  constructor () {
    this.appVersion = process.env.VUE_APP_VERSION
    this.appID = process.env.VUE_APP_LOGROCKET_ID
  }

  async init (identity: string | number) {
    try {
      if (process.client && this.appID && !this.isInited) {
        if (!this.client) {
          this.client = (await import(/* webpackChunkName: "logrocket" */ 'logrocket')).default
        }
        const { requestSanitizer, responseSanitizer } = LogrocketFuzzySanitizer.setup(privateFieldNames)
        this.client.init(this.appID, {
          release: this.appVersion,
          rootHostname: window.location?.origin,
          network: {
            requestSanitizer: (request: any) => {
              if (request.headers['Authorization']) {
                request.headers['Authorization'] = '*'
              }
              return requestSanitizer(request)
            },
            responseSanitizer
          },
        })
        this.isInited = true
      }
      if (this.client && identity) {
        this.client.identify(`${identity}`)
      }
    } catch (e) {
      console.error('Error init LogRocket', e)
    }
  }
}

export default new LogRocket()
