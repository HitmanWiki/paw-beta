import { EventEmitter } from 'events'

export class MetamaskProvider {
  provider?: any;
  events: EventEmitter

  constructor () {
    this.events = new EventEmitter()
    if (this.isAvailable() && process.client) {
      this.provider = window.ethereum
      window.ethereum.autoRefreshOnNetworkChange = false
      window.ethereum.on('accountsChanged', async (accounts: string) => {
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          const web3Utils = (await import(/* webpackChunkName: "web3-utils" */ 'web3-utils')).default
          this.events.emit(
            'accountsChanged',
            accounts.map(item => web3Utils.toChecksumAddress(item))
          )
        }
        if (accounts && Array.isArray(accounts) && accounts.length === 0) {
          this.events.emit('disconnect')
        }
      })
      window.ethereum.on('chainChanged', (chainId: string) => {
        if (chainId) {
          this.events.emit('chainChanged', parseInt(chainId, 16))
        }
      })
      window.ethereum.on('connect', () => {
        this.events.emit('connect')
      })
      window.ethereum.on('disconnect', () => {
        this.events.emit('disconnect')
      })
    }
  }

  public async getProviderAsync (): Promise<any> {
    return process.client ? window.ethereum : null
  }

  public isAvailable (): boolean {
    return process.client && !!window.ethereum && window.ethereum.isMetaMask
  }

  public async isConnected (): Promise<boolean> {
    const status: string | null = await this.address()
    return !!status
  }

  public async address (): Promise<string | null> {
    if (this.isAvailable()) {
      const accounts = await (await this.getProviderAsync()).request({ method: 'eth_requestAccounts' })
      const web3Utils = (await import(/* webpackChunkName: "web3-utils" */ 'web3-utils')).default
      return web3Utils.toChecksumAddress(accounts[0])
    } else {
      return null
    }
  }

  public async chainId (): Promise<number | null> {
    if (this.isAvailable()) {
      const chainId = await (await this.getProviderAsync()).request({ method: 'net_version' })
      return parseInt(chainId)
    } else {
      return null
    }
  }
}

export default new MetamaskProvider()
