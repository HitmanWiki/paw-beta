// @ts-ignore
import Cookies from 'js-cookie'
import cloneDeep from 'lodash/cloneDeep'
import { Roles, USER_TYPE_CUSTOMER_PERSON } from '@/constants-ts/user/roles'

const GA_KEY = 'G-F6BNV2NELV'

class GoogleAnalyticsV2 {
  private authorized: string = 'N'
  private account: string = 'N'
  private userid: string = ''
  private role: string = ''
  private hitRole: string = ''
  private roleCustomer: string = ''
  private requestsQueue: Array <{}> = []
  private queueTimeout: ReturnType<typeof setTimeout> | null
  private countCompletedJobs: number = 0
  private countPaidJobs: number = 0
  private segment: string = 'New'

  constructor () {
    this.setAccount()
  }

  public setSegment (countCompletedJobs: number, countPaidJobs: number) {
    this.countCompletedJobs = countCompletedJobs
    this.countPaidJobs = countPaidJobs
    this.segment = countCompletedJobs + countPaidJobs > 2 ? 'Old' : 'New'
  }

  public setAuthorized (authorized: boolean) {
    this.authorized = authorized ? 'Y' : 'N'
  }

  public setAccount () {
    const lxAccount = Cookies.get('lxAccount')
    this.account = lxAccount ? 'Y' : 'N'
  }

  public setUserid (userid: string) {
    this.userid = userid || ''
  }

  public setRole (profiles: any, activeRole: number) {
    if (!profiles || !activeRole) {
      this.role = ''
      return
    }
    if (profiles[Roles.FREELANCER] && profiles[Roles.CUSTOMER]) {
      this.role = 'full-stack-gig'
    } else if (activeRole === Roles.FREELANCER) {
      this.role = 'Talent'
    } else {
      this.role = 'Customer'
    }
  }

  public setHitRole (activeRole: number) {
    switch (activeRole) {
      case Roles.FREELANCER: {
        this.hitRole = 'Talent'
        break
      }
      case Roles.CUSTOMER: {
        this.hitRole = 'Customer'
        break
      }
      default: {
        this.hitRole = ''
      }
    }
  }

  public setRoleCustomer (activeRole: number, customerType: number) {
    if (activeRole === Roles.CUSTOMER) {
      this.roleCustomer = customerType === USER_TYPE_CUSTOMER_PERSON
        ? 'Private Person'
        : 'Company'
    } else {
      this.roleCustomer = ''
    }
  }

  public initializeState ({
    authorized = false,
    userid = '',
    profiles,
    activeRole = 0,
    customerType,
    countCompletedJobs = 0,
    countPaidJobs = 0,
  }: {
    authorized: boolean,
    userid: string,
    profiles: any,
    activeRole: number,
    customerType: number,
    countCompletedJobs: number,
    countPaidJobs: number,
  }) {
    this.setAuthorized(authorized)
    this.setAccount()
    this.setUserid(userid)
    this.setRole(profiles, activeRole)
    this.setHitRole(activeRole)
    this.setRoleCustomer(activeRole, customerType)
    this.setSegment(countCompletedJobs, countPaidJobs)
  }

  public isAvailable (): boolean {
    return window.hasOwnProperty('dataLayer')
  }

  public hasAnalytic (): boolean {
    return process.client && process.env.VUE_APP_MODE !== 'dev'
  }

  public send (params: any) {
    const requestParams = {
      authorized: this.authorized,
      account: this.account,
      userid: this.userid,
      role: this.role,
      'hit-role': this.hitRole,
      'role-customer': this.roleCustomer,
      'completed_jobs': this.countCompletedJobs,
      'paid_jobs': this.countPaidJobs,
      'segment': this.segment,
      ...params,
    }
    if (!this.hasAnalytic()) {
      console.log(requestParams)
      return
    }
    if (this.isAvailable()) {
      if (this.requestsQueue.length > 0) {
        if (this.queueTimeout) {
          clearTimeout(this.queueTimeout)
          this.queueTimeout = null
        }
        this.requestsQueue.push(requestParams)
        window.dataLayer.concat(cloneDeep(this.requestsQueue))
        this.requestsQueue = []
      } else {
        window.dataLayer.push(requestParams)
      }
    } else {
      this.requestsQueue.push(requestParams)
      if (!this.queueTimeout) {
        const timeoutHandler = () => {
          if (this.isAvailable()) {
            window.dataLayer.concat(cloneDeep(this.requestsQueue))
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

  public async getGAData () {
    if (this.isAvailable()) {
      const sid: string = await (new Promise(resolve => {
        window.gtag('get', GA_KEY, 'session_id', resolve)
      }))
      const cid: string = await (new Promise(resolve => {
        window.gtag('get', GA_KEY, 'client_id', resolve)
      }))
      return { clientId: cid, sessionId: sid }
    }
  }
}

export default new GoogleAnalyticsV2()
