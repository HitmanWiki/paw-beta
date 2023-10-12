import { EventEmitter } from 'events'
import Deferred from 'promise-deferred'

export class TronLinkProvider {
  events: EventEmitter
  tronLink: any
  tronWeb: any

  constructor () {
    this.events = new EventEmitter()
    if (process.client) {
      window.addEventListener('message', (e) => {
        if (e.data.message && e.data.message.action === 'setAccount') {
          this.events.emit(
            'accountsChanged',
            [e.data.message.data.address]
          )
        }
        if (e.data.message && e.data.message.action === 'setNode') {
          this.events.emit(
            'nodeChanged',
            e.data.message.data.node.fullNode
          )
        }
        if (e.data.message && e.data.message.action === 'connect') {
          this.events.emit('connect')
        }
        if (e.data.message && e.data.message.action === 'disconnect') {
          this.events.emit('disconnect')
        }
      })
    }
  }

  public initWithoutAwait () {
    if (process.client && this.isAvailable) {
      this.tronWeb = window.tronWeb
      this.tronLink = window.tronLink
    }
  }

  public async awaitInitWithTimeout (): Promise<any> {
    if (process.client) {
      const deferred = new Deferred()
      setImmediate(async () => {
        if (this.isAvailable && await this.address()) {
          this.tronWeb = window.tronWeb
          this.tronLink = window.tronLink
          deferred.resolve(null)
        }
        let counter = 0
        let interval = setInterval(async () => {
          counter += 300
          if (this.isAvailable && await this.address()) {
            this.tronWeb = window.tronWeb
            this.tronLink = window.tronLink
            deferred.resolve(null)
            clearInterval(interval)
          }
          if (counter > 6000) {
            deferred.reject()
            clearInterval(interval)
          }
        }, 300)
      })
      await deferred.promise
    }
  }

  public async connect () {
    if (process.client && this.isAvailable) {
      const res = await window.tronLink.request({ method: 'tron_requestAccounts' })
      return res
    }
    return {
      code: 100, message: 'TronLink is not available or this is not client side'
    }
  }

  get tronWebState (): any {
    return {
      installed: !!window.tronWeb,
      loggedIn: window.tronWeb && window.tronWeb.ready
    }
  }

  get isAvailable (): boolean {
    return !!window?.tronWeb
  }

  get isConnected (): boolean {
    return window.tronWeb && window.tronWeb.ready
  }

  public async address (): Promise<string | null> {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      return window.tronWeb.defaultAddress.base58
    }
    return null
  }

  public async node (): Promise<string | null> {
    if (window.tronWeb && window.tronWeb?.fullNode?.host) {
      return window.tronWeb?.fullNode?.host
    }
    return null
  }
}

export default new TronLinkProvider()
