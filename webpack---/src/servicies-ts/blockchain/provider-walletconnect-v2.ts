import IWalletConnectProviderV2 from '@walletconnect/universal-provider/dist/types/UniversalProvider'
import { EventEmitter } from 'events'
import storeFromContext from '@/store/storeFromContext'
import { Store } from 'vuex'
import store from 'store'
import WalletConnectQr from '@/modals/WalletConnectQr/WalletConnectQr.vue'
import { RootState } from '@/store'

let walletConnectModel: WalletConnectProviderV2 | null = null

export class WalletConnectProviderV2 {
  provider?: IWalletConnectProviderV2 | null;
  events: EventEmitter // connect, disconnect, updatedItems({ chainIds: [], addresses: [] })
  qrModalId: any

  constructor () {
    this.events = new EventEmitter()
    if (this.isAvailable()) {
      this.getProviderAsync().then(() => this.addListeners())
    }
  }

  public async addListeners () {
    this.provider?.on('display_uri', async (uri: string) => {
      console.log('WC_EVENT_DISPLAY_URI', uri)
      const store: Store<RootState> = storeFromContext()
      const qrModalId = await store.dispatch('ui/openModal', {
        component: WalletConnectQr,
        props: { uri }
      })
      this.qrModalId = qrModalId
    })

    // Subscribe to session ping
    this.provider?.on('session_ping', ({ id, topic }: any) => {
      console.log('WC_EVENT_SESSION_PING')
      console.log(id, topic)
    })

    // Subscribe to connect
    this.provider?.on('connect', async (data: any) => {
      console.log('WC_EVENT_CONNECT', data)
      const { chainIds, addresses } = this.getChainsAndAddress(data?.session)
      this.events.emit('connect', { chainIds, addresses })
      if (this.qrModalId) {
        const store: Store<RootState> = storeFromContext()
        await store.dispatch('ui/closeModal', this.qrModalId)
        this.qrModalId = null
      }
    })

    // Subscribe to disconnect
    this.provider?.on('disconnect', (data: any) => {
      console.log('WC_EVENT_DISCONNECT', 'disconnect', data)
      this.events.emit('disconnect')
    })

    // Subscribe to session update
    this.provider?.on('session_update', ({ params }: any) => {
      console.log('WC_EVENT_SESSION_UPDATED', params)
      const { chainIds, addresses } = this.getChainsAndAddress(params)
      this.events.emit('updatedItems', { chainIds, addresses })
    })

    this.provider?.on('session_delete', () => {
      console.log('WC_EVENT_SESSION_DELETE')
      this.events.emit('disconnect')
    })

    // Subscribe to session event
    // this.provider?.on('session_event', ({ params }: any) => {
    //   console.log('WC_EVENT_SESSION_EVENT', params)
    //   this.getChainsAndAddress(params)
    //   // this.events.emit('updatedItems', { chainIds: [], addresses: [] })
    // })
  }

  public getChainsAndAddress (session: any): any {
    const namespace: any = Object.values<any>(session.namespaces)?.[0] || {}
    const accounts: any[] = namespace?.accounts || []
    const chainIds: number[] = []
    const addresses: string[] = []
    accounts.forEach((item: string) => {
      const splitted = item.split(':')
      if (splitted.length === 2) {
        chainIds.push(parseInt(splitted[0]))
        addresses.push(splitted[1])
      } else {
        chainIds.push(parseInt(splitted[1]))
        addresses.push(splitted[2])
      }
    })
    return {
      addresses: [...new Set(addresses)],
      chainIds: [...new Set(chainIds)]
    }
  }

  public async getProviderAsync (): Promise<any> {
    if (this.provider) return this.provider
    const UniversalProvider = (
      await import(/* webpackChunkName: "@walletconnect/universal-provider" */ '@walletconnect/universal-provider')
    ).default
    this.provider = await UniversalProvider.init({
      projectId: process.env.VUE_APP_WALLETCONNECT_PROJECT_ID || '',
      relayUrl: process.env.VUE_APP_WALLETCONNECT_RELAY_URL || '',
      metadata: {
        name: 'Laborx',
        description: 'Blockchain-based jobs platform',
        url: window.location.host,
        icons: [`${window.location.origin}/img/wc-bg.png`]
      }
    })
    this.addListeners()
    return this.provider
  }

  public async sessionConnect (chainIds: number[] = []) {
    try {
      if (!this.provider) {
        await this.getProviderAsync()
      }
      const namespaces = {
        eip155: {
          methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
          ],
          chains: chainIds.map(network => `eip155:${network}`), // TODO for ['eip155:1', 'eip155:56', 'eip155:137']
          events: ['chainChanged', 'accountsChanged']
        },
      }
      await this.provider?.connect({ namespaces })
    } catch (err: any) {
      const store: Store<RootState> = storeFromContext()
      store.commit('ui/updateModalProps', {
        id: this.qrModalId,
        props: {
          error: err?.message || 'Unrecognized error during connection'
        }
      })
      console.log('Session Connect error', err?.message)
    }
  }

  public isAvailable (): boolean {
    return true
  }

  public isConnected (): boolean {
    return !!this.provider?.session
  }

  public async getChainIdsAndAddresses (): Promise<{ addresses: string[], chainIds: string[] } | null> {
    if (this.provider && this.provider?.session) {
      const { addresses, chainIds } = await this.getChainsAndAddress(this.provider?.session)
      return { addresses, chainIds }
    } else {
      return null
    }
  }

  public async disconnect () {
    if (this.provider) {
      this.provider.cleanupPendingPairings({}).then(() => console.log('provider cleanup pending pairings'))
      this.provider.disconnect().then(() => console.log('provider disconnected success'))
      this.provider = null
      this.events.emit('disconnect')
      store.each((value, key) => {
        if (key && key?.slice(0, 4) === 'wc@2') {
          store.remove(key)
        }
      })
    }
  }
}

export async function getWalletProviderConnectV2Async (): Promise<WalletConnectProviderV2> {
  if (!walletConnectModel) {
    walletConnectModel = new WalletConnectProviderV2()
    await walletConnectModel.getProviderAsync()
  }
  return walletConnectModel
}
