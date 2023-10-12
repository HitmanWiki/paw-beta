import { Roles } from '@/constants-ts/user/roles'
import { googleAnalyticsV2 } from '.'

class LxAnalyticsService {
  private requestsQueue: Array <{event: string, eventParams?: any}> = []
  private queueTimeout: ReturnType<typeof setTimeout> | null

  public setUserId (id: LxAnalytics['user_id']) {
    if (window?.lxAnalytics) {
      window.lxAnalytics.user_id = id
    }
  }

  public setRole (role: Roles) {
    if (window?.lxAnalytics) {
      window.lxAnalytics.role_id = role
    }
  }

  public isAvailable (): boolean {
    return window?.hasOwnProperty?.('lxAnalytics')
  }

  public hasAnalytic (): boolean {
    return process.client
  }

  public send (event: string, eventParams?: any) {
    if (!this.isAvailable()) {
      console.log(event, eventParams)
      return
    }
    if (this.isAvailable()) {
      if (this.requestsQueue.length > 0) {
        if (this.queueTimeout) {
          clearTimeout(this.queueTimeout)
          this.queueTimeout = null
        }
        this.requestsQueue.push({ event, eventParams })
        this.requestsQueue.forEach(request => window.lxAnalytics?.(request.event, request.eventParams))
        this.requestsQueue = []
      } else {
        window.lxAnalytics?.(event, eventParams)
      }
    } else {
      this.requestsQueue.push({ event, eventParams })
      if (!this.queueTimeout) {
        const timeoutHandler = () => {
          if (this.isAvailable()) {
            this.requestsQueue.forEach(request => window.lxAnalytics?.(request.event, request.eventParams))
            this.requestsQueue = []
            this.queueTimeout = null
          } else {
            this.queueTimeout = setTimeout(timeoutHandler, 200)
          }
        }
        this.queueTimeout = setTimeout(timeoutHandler, 200)
      }
    }
  }

  public async sendGAData (token: string) {
    const data = await googleAnalyticsV2.getGAData()
    if (this.isAvailable() && data) {
      window.lxAnalytics?.setGASession?.({ cId: data.clientId, sId: data.sessionId, token })
    }
  }
}

export default new LxAnalyticsService()
