import { Commit, Dispatch, Module } from 'vuex'
import Deferred from 'promise-deferred'
import cloneDeep from 'lodash/cloneDeep'
import uniqueId from 'lodash/uniqueId'
import { extractRevert } from '@/utils-ts/transaction'
import { ISignState } from './types'
import { getTxLink } from '@/utils/etherscan'
import { getTxLink as getTxLinkTron } from '@/utils-ts/tron/tronscan'
import SignData, { MethodNameTypeV1, MethodNameTypeV2, TypeSignData } from '@/models-ts/sign-process/SignData'
import LaborXContractV1, { getLaborXContractV1Async } from '@/servicies-ts/blockchain/laborx-contract-v1'
import LaborXContractV2, { getLaborXContractV2Async } from '@/servicies-ts/blockchain/laborx-contract-v2'
import { Erc20ContractTron, getErc20ContractTronAsync } from '@/servicies-ts/blockchain/tron/erc20-contract'
import Currency from '@/models-ts/Currency'
import Wallet from '@/models-ts/Wallet'
import { txSend } from '@/servicies-ts/blockchain/tx-sender'
import { Blockchain, WalletGroup } from '@/constants-ts/blockchain'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'
import { SnackTypes } from '@/constants-ts/SnackTypes'
import { METHOD_SUCCESS_EVENT } from '@/constants/blockchain/contract'
import Erc20Contract, { getErc20ContractAsync, MethodMode } from '@/servicies-ts/blockchain/erc20-contract'
import BackendTxDetailsV1 from '@/servicies-ts/backend/backend-tx-details-v1'
import BackendTxDetailsV2 from '@/servicies-ts/backend/backend-tx-details-v2'
import { MAX_AMOUNT_APPROVE } from '@/constants/blockchain/erc20'
import Metamask, { MetamaskProvider } from '@/servicies-ts/blockchain/provider-metamask'
import {
  getWalletProviderConnectV2Async,
  WalletConnectProviderV2
} from '@/servicies-ts/blockchain/provider-walletconnect-v2'
import CreateContractSignDataV2 from '@/models-ts/sign-process/CreateContractSignDataV2'
import { ContractType, ContractVersion, getSuccessEventNameByMethodName } from '@/constants-ts/contracts'
import PendingTx, { TypeAwait } from '@/models-ts/PendingTx'
import { getLaborXContractTronAsync, LaborXContractTronV2 } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'
import TronLinkProvider from '@/servicies-ts/blockchain/tron/provider-tronlink'

const SIGNING_MODAL_ID = 'lx-confirm-signing-modal'

const getInitialState = (): ISignState => ({
  loading: false,
  signing: false,
  approving: false,
  contract: null,
  signData: null,
  chainIds: null,
  addresses: null,
  tronLinkNode: null,
  isAvailable: false,
  isConnected: false,
  addressListener: null,
  chainIdListener: null,
  updatedItemsListener: null, // Listener for WalletConnectV2, because we are getting in one event addresses and chains
  connectListener: null,
  disconnectListener: null,
})

const signProcess = (): Module<ISignState, any> => {
  return ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
      resetState (state: ISignState) {
        Object.assign(state, getInitialState())
      },
      setLoading: (state: ISignState, flag: boolean) => {
        state.loading = flag
      },
      setSigning: (state: ISignState, flag: boolean) => {
        state.signing = flag
      },
      setApproving: (state: ISignState, flag: boolean) => {
        state.approving = flag
      },
      setSignData: (state: ISignState, signData: SignData<any, any, any>) => {
        state.signData = signData
      },
      setContract: (state: ISignState, contract: LaborXContractV1) => {
        state.contract = contract
      },
      setIsAvailable: (state: ISignState, flag: boolean) => {
        state.isAvailable = flag
      },
      setIsConnected: (state: ISignState, flag: boolean) => {
        state.isConnected = flag
      },
      setChainId: (state: ISignState, chainId: number | null) => {
        state.chainIds = chainId ? [chainId] : null
      },
      setAddress: (state: ISignState, address: string | null) => {
        state.addresses = address ? [address] : null
      },
      setChainIds: (state: ISignState, chainIds: number[] | null) => {
        state.chainIds = chainIds
      },
      setAddresses: (state: ISignState, addresses: string[] | null) => {
        state.addresses = addresses
      },
      setTronLinkNode: (state: ISignState, tronLinkNode: string | null) => {
        state.tronLinkNode = tronLinkNode
      },
      setChainIdListener: (state: ISignState, listener: () => void) => {
        state.chainIdListener = listener
      },
      setAddressListener: (state: ISignState, listener: () => void) => {
        state.addressListener = listener
      },
      setUpdatedItemsListener: (state: ISignState, listener: () => void) => {
        state.updatedItemsListener = listener
      },
      setConnectListener: (state: ISignState, listener: () => void) => {
        state.connectListener = listener
      },
      setDisconnectListener: (state: ISignState, listener: () => void) => {
        state.disconnectListener = listener
      },
    },
    getters: {
      address (state: ISignState) {
        return state.addresses ? state.addresses[0] : null
      },
      chainId (state: ISignState) {
        return state.chainIds ? state.chainIds[0] : null
      }
    },
    actions: {
      async initMetamask (
        { state, commit }: { state: ISignState, commit: Commit }
      ) {
        const provider: MetamaskProvider = Metamask
        commit('setIsAvailable', provider.isAvailable())
        commit('setIsConnected', await provider.isConnected())
        const chainId = await provider.chainId()
        const address = await provider.address()
        commit('setChainId', chainId)
        commit('setAddress', address)
        const chainIdListener = async (chainId: number) => {
          commit('setChainId', chainId)
          if (state.addresses === null) {
            commit('setAddress', await provider.address())
          }
        }
        const addressListener = (accounts: string[]) => {
          commit('setAddress', accounts[0])
        }
        const connectListener = () => {
          commit('setIsConnected', true)
        }
        const disconnectListener = () => {
          commit('setIsConnected', false)
          commit('setChainId', null)
          commit('setAddress', null)
        }
        commit('setChainIdListener', chainIdListener)
        commit('setAddressListener', addressListener)
        commit('setConnectListener', connectListener)
        commit('setDisconnectListener', disconnectListener)
        provider.events.on('chainChanged', chainIdListener)
        provider.events.on('accountsChanged', addressListener)
        provider.events.on('connect', connectListener)
        provider.events.on('disconnect', disconnectListener)
      },
      destroyMetamask (
        { state, commit }: { state: ISignState, commit: Commit }
      ) {
        const provider: MetamaskProvider = Metamask
        state.chainIdListener && provider.events.removeListener('chainChanged', state.chainIdListener)
        state.addressListener && provider.events.removeListener('accountsChanged', state.addressListener)
        state.connectListener && provider.events.removeListener('connect', state.connectListener)
        state.disconnectListener && provider.events.removeListener('disconnect', state.disconnectListener)
        commit('setIsAvailable', false)
        commit('setIsConnected', false)
        commit('setChainId', null)
        commit('setAddress', null)
      },
      async initTronLink (
        { state, commit }: { state: ISignState, commit: Commit }
      ) {
        TronLinkProvider.initWithoutAwait()
        commit('setIsAvailable', TronLinkProvider.isAvailable)
        commit('setIsConnected', TronLinkProvider.isConnected)
        const node = await TronLinkProvider.node()
        const address = await TronLinkProvider.address()
        commit('setTronLinkNode', node)
        commit('setAddress', address)
        const nodeListener = async (node: string) => {
          commit('setTronLinkNode', node)
          if (state.addresses === null) {
            commit('setAddress', await TronLinkProvider.address())
          }
        }
        const addressListener = (accounts: string[]) => {
          commit('setAddress', accounts[0])
        }
        const connectListener = async () => {
          const node = await TronLinkProvider.node()
          const address = await TronLinkProvider.address()
          commit('setTronLinkNode', node)
          commit('setAddress', address)
          commit('setIsConnected', true)
        }
        const disconnectListener = () => {
          commit('setIsConnected', false)
          commit('setTronLinkNode', null)
          commit('setAddress', null)
        }
        commit('setChainIdListener', nodeListener)
        commit('setAddressListener', addressListener)
        commit('setConnectListener', connectListener)
        commit('setDisconnectListener', disconnectListener)
        TronLinkProvider.events.on('nodeChanged', nodeListener)
        TronLinkProvider.events.on('accountsChanged', addressListener)
        TronLinkProvider.events.on('connect', connectListener)
        TronLinkProvider.events.on('disconnect', disconnectListener)
      },
      destroyTronLink (
        { state, commit }: { state: ISignState, commit: Commit }
      ) {
        const provider: MetamaskProvider = Metamask
        state.chainIdListener && provider.events.removeListener('nodeChanged', state.chainIdListener)
        state.addressListener && provider.events.removeListener('accountsChanged', state.addressListener)
        state.connectListener && provider.events.removeListener('connect', state.connectListener)
        state.disconnectListener && provider.events.removeListener('disconnect', state.disconnectListener)
        commit('setIsAvailable', false)
        commit('setIsConnected', false)
        commit('setTronLinkNode', null)
        commit('setAddress', null)
      },
      async initWalletConnect (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch }
      ) {
        const provider: WalletConnectProviderV2 = await getWalletProviderConnectV2Async()
        commit('setIsAvailable', provider.isAvailable())
        commit('setIsConnected', provider.isConnected())
        const walletData = await provider.getChainIdsAndAddresses()
        commit('setChainIds', walletData?.chainIds)
        commit('setAddresses', walletData?.addresses)
        const updatedItemsListener = ({ chainIds, addresses }: any) => {
          commit('setChainIds', chainIds)
          commit('setAddresses', addresses)
        }
        const connectListener = async ({ chainIds, addresses }: any) => {
          commit('setChainIds', chainIds)
          commit('setAddresses', addresses)
          commit('setIsConnected', true)
        }
        const disconnectListener = () => {
          commit('setIsConnected', false)
          commit('setChainIds', null)
          commit('setAddresses', null)
        }
        commit('setUpdatedItemsListener', updatedItemsListener)
        commit('setConnectListener', connectListener)
        commit('setDisconnectListener', disconnectListener)
        provider.events.on('updatedItems', updatedItemsListener)
        provider.events.on('connect', connectListener)
        provider.events.on('disconnect', disconnectListener)
      },
      async destroyWalletConnect (
        { state, commit }: { state: ISignState, commit: Commit }
      ) {
        const provider: WalletConnectProviderV2 = await getWalletProviderConnectV2Async()
        state.updatedItemsListener && provider.events.removeListener('updatedItems', state.updatedItemsListener)
        state.connectListener && provider.events.removeListener('connect', state.connectListener)
        state.disconnectListener && provider.events.removeListener('disconnect', state.disconnectListener)
        commit('setIsAvailable', false)
        commit('setIsConnected', false)
        commit('setChainIds', null)
        commit('setAddresses', null)
      },
      async setWallet ({ state, commit, dispatch }, wallet: Wallet) {
        commit('setLoading', true)
        switch (state.signData?.wallet.group) {
          case WalletGroup.Metamask:
            await dispatch('destroyMetamask')
            break
          case WalletGroup.WalletConnect:
            await dispatch('destroyWalletConnect')
            break
          case WalletGroup.TronLink:
            await dispatch('destroyTronLink')
            break
        }
        const rates = await dispatch('app/getRates', null, { root: true })
        const signData = cloneDeep(state.signData as CreateContractSignDataV2)
        await signData.setWallet(wallet, rates)
        commit('setSignData', signData)
        try {
          switch (signData.wallet.group) {
            case WalletGroup.Metamask:
              await dispatch('initMetamask')
              break
            case WalletGroup.WalletConnect:
              await dispatch('initWalletConnect')
              break
            case WalletGroup.TronLink:
              await dispatch('initTronLink')
              break
          }
        } catch (err) {
          console.error(err)
        }
        commit('setLoading', false)
      },
      async setCurrency (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch },
        currency: Currency
      ) {
        commit('setLoading', true)
        const rates = await dispatch('app/getRates', null, { root: true })
        const signData = cloneDeep(state.signData as CreateContractSignDataV2)
        await signData.setCurrency(currency, rates)
        commit('setSignData', signData)
        commit('setLoading', false)
      },
      async setGas (
        { state, commit }: { state: any, commit: Commit },
        gasPrice: string
      ) {
        const signData = cloneDeep(state.signData)
        signData.setGasPrice && await signData.setGasPrice(gasPrice)
        commit('setSignData', signData)
      },
      async init (
        { commit, dispatch }: { commit: Commit, dispatch: Dispatch },
        { signData }: { signData: SignData<any, any, any> }
      ) {
        commit('setSignData', signData)
        try {
          switch (signData.wallet.group) {
            case WalletGroup.Metamask:
              await dispatch('initMetamask')
              break
            case WalletGroup.WalletConnect:
              await dispatch('initWalletConnect')
              break
            case WalletGroup.TronLink:
              await dispatch('initTronLink')
              break
          }
        } catch (err) {
          console.error(err)
        }
        let modalFactory
        if (signData.type === TypeSignData.CreateContract) {
          modalFactory = import(/* webpackChunkName: "cash-modals" */ '@/modals/HiringFreelancer/HiringFreelancer.vue')
        } else if (signData.type === TypeSignData.PayContract) {
          modalFactory = import(/* webpackChunkName: "cash-modals" */ '@/modals/PayToFreelancer/PayToFreelancer.vue')
        } else if (signData.type === TypeSignData.Refund) {
          modalFactory = import(/* webpackChunkName: "cash-modals" */ '@/modals/Refund/Refund.vue')
        }
        await dispatch(
          'ui/openModal',
          {
            component: 'lx-lazy-modal',
            id: SIGNING_MODAL_ID,
            props: {
              factory: modalFactory,
              title: 'New contract',
            }
          },
          { root: true }
        )
      },
      async approve ({ state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch }) {
        if (state?.signData?.blockchain === Blockchain.Tron) {
          await dispatch('approveTron')
        } else {
          await dispatch('approveEvm')
        }
      },
      async approveEvm ({ state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch }) {
        let tx: string = ''
        let link: string = ''
        try {
          commit('setApproving', true)
          let signData = state.signData as CreateContractSignDataV2
          const chainId = signData?.chainId || 4
          const address = signData?.currency.address
          const erc20Contract: Erc20Contract = await getErc20ContractAsync({ chainId, address: address || '' })
          // @ts-ignore
          const encodedAbi: string = await erc20Contract.approve({
            mode: MethodMode.ENCODE_ABI,
            from: signData?.wallet.address || '',
            spender: signData?.approve?.spender || '',
            amount: MAX_AMOUNT_APPROVE
          })
          const feeDetail: PaymentDetail | undefined = (signData?.approve?.details || [])
            .find((item: PaymentDetail) => item.type === PaymentDetailsTypes.Fee)
          const gasLimit: number = feeDetail?.gasLimit?.toNumber() || 0
          const { eventEmitter } = await txSend({
            walletGroup: signData?.wallet.group || WalletGroup.Metamask,
            chainId: signData?.chainId,
            from: signData?.wallet.address || '',
            to: erc20Contract.contractInstance.options.address,
            value: '0',
            encodedAbi,
            gasPrice: signData?.gasPrice || '0',
            gasLimit
          })
          const deferred = new Deferred<string>()
          eventEmitter
            .on('transactionHash', (hash: string) => {
              deferred.resolve(hash)
            })
            .on('error', (err: Error) => {
              console.error(err)
              deferred.reject(err)
            })
          tx = await deferred.promise
          link = getTxLink({ chainId: signData?.chainId, tx })
          const pendingTx = new PendingTx({
            typeAwait: TypeAwait.FromBlockchain,
            txId: tx,
            params: {
              blockchain: signData?.blockchain,
              txId: tx,
            },
            title: 'Transaction',
            text: `Waiting for <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a> confirmation from the network`, // eslint-disable-line
          })
          await dispatch('pendingTxs/addAndAwaitTx', pendingTx, { root: true })
          signData = cloneDeep(state.signData as CreateContractSignDataV2)
          signData.approve = undefined
          commit('setSignData', signData)
          dispatch('snacks/deleteSnackbar', tx, { root: true })
        } catch (err) {
          console.error(err)
          dispatch('snacks/deleteSnackbar', tx, { root: true })
          const revertReason = extractRevert(err)
          dispatch('snacks/openSnackbar', {
            id: uniqueId(),
            type: SnackTypes.FAILURE,
            title: 'Transaction failure',
            text: ![undefined, ''].includes(revertReason)
              ? `Transaction failed. Reason: ${revertReason}. Please try again.`
              : `Unsuccessful <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a>`
          }, { root: true })
        } finally {
          commit('setApproving', false)
        }
      },
      async approveTron ({ state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch }) {
        let txId: string = ''
        let link: string = ''
        try {
          commit('setApproving', true)
          let signData = state.signData as CreateContractSignDataV2
          const address = signData?.currency.address
          const erc20Contract: Erc20ContractTron = await getErc20ContractTronAsync({
            contractType: ContractType.WriteWithTronLink,
            address: address
          })
          // @ts-ignore
          txId = await erc20Contract.approve({
            spender: signData?.approve?.spender!,
            amount: MAX_AMOUNT_APPROVE
          })
          link = getTxLinkTron({ tx: txId })
          const pendingTx = new PendingTx({
            typeAwait: TypeAwait.FromBlockchain,
            txId,
            params: {
              blockchain: signData?.blockchain,
              txId,
            },
            title: 'Transaction',
            text: `Waiting for <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a> confirmation from the network`, // eslint-disable-line
          })
          await dispatch('pendingTxs/addAndAwaitTx', pendingTx, { root: true })
          signData = cloneDeep(state.signData as CreateContractSignDataV2)
          signData.approve = undefined
          commit('setSignData', signData)
          dispatch('snacks/deleteSnackbar', txId, { root: true })
        } catch (err) {
          console.error(err)
          dispatch('snacks/deleteSnackbar', txId, { root: true })
          const revertReason = extractRevert(err)
          dispatch('snacks/openSnackbar', {
            id: uniqueId(),
            type: SnackTypes.FAILURE,
            title: 'Transaction failure',
            text: ![undefined, ''].includes(revertReason)
              ? `Transaction failed. Reason: ${revertReason}. Please try again.`
              : `Unsuccessful <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a>`
          }, { root: true })
        } finally {
          commit('setApproving', false)
        }
      },
      async sign (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch },
      ) {
        if (state?.signData?.blockchain === Blockchain.Tron) {
          await dispatch('signTronV2')
        } else {
          if (state?.signData?.version === ContractVersion.v1) {
            await dispatch('signV1')
          }
          console.log('state?.signData', state?.signData)
          if (state?.signData?.version === ContractVersion.v2) {
            await dispatch('signV2')
          }
        }
      },
      async signV1 (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch },
      ) {
        let tx: string = ''
        let link: string = ''
        try {
          commit('setSigning', true)
          const signData = state.signData as SignData<MethodNameTypeV1, any, any>
          const chainId = signData.chainId || 4
          const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId: state.signData?.chainId || 4 })
          await BackendTxDetailsV1[signData.methodName](signData.backendParams)
          const encodedAbi = contract.methodSwitch(signData.methodName, {
            ...state.signData?.methodArgs || {},
            mode: 'encodeABI',
            value: state.signData?.payableAmount || '0',
          }) as string
          const feeDetail: PaymentDetail | undefined = (state.signData?.paymentDetails || [])
            .find((item: PaymentDetail) => item.type === PaymentDetailsTypes.Fee)
          const gasLimit: number = feeDetail?.gasLimit?.toNumber() || 0
          const { eventEmitter } = await txSend({
            walletGroup: state.signData?.wallet.group || WalletGroup.Metamask,
            chainId,
            from: state.signData?.wallet.address || '',
            to: contract.contractInstance.options.address,
            value: state.signData?.payableAmount || '0',
            encodedAbi,
            gasPrice: state.signData?.gasPrice || '0',
            gasLimit
          })
          const deferred = new Deferred<string>()
          eventEmitter
            .on('transactionHash', (hash: string) => {
              deferred.resolve(hash)
            })
            .on('error', (err: Error) => {
              console.error(err)
              deferred.reject(err)
            })
          tx = await deferred.promise
          link = getTxLink({ chainId: state.signData?.chainId, tx })
          const pendingTx = new PendingTx({
            typeAwait: TypeAwait.FromBackend,
            txId: tx,
            params: {
              blockchain: state.signData?.blockchain,
              scId: state.signData?.backendParams?.scId,
              txId: tx,
              // @ts-ignore
              event: METHOD_SUCCESS_EVENT[signData.methodName + signData.methodArgs.postfix]
            },
            title: 'Transaction',
            text: `Waiting for <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a> confirmation from the network`, // eslint-disable-line
          })
          await dispatch('pendingTxs/addAndAwaitTx', pendingTx, { root: true })
          dispatch('snacks/deleteSnackbar', tx, { root: true })
          await dispatch('ui/closeModal', {}, { root: true })
          state?.signData?.successCb(tx, signData)
        } catch (err) {
          console.error(err)
          dispatch('snacks/deleteSnackbar', tx, { root: true })
          const revertReason = extractRevert(err)
          dispatch('snacks/openSnackbar', {
            id: uniqueId(),
            type: SnackTypes.FAILURE,
            title: 'Transaction failure',
            text: ![undefined, ''].includes(revertReason)
              ? `Transaction failed. Reason: ${revertReason}. Please try again.`
              : `Unsuccessful <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a>`
          }, { root: true })
        } finally {
          commit('setSigning', false)
        }
      },
      async signV2 (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch },
      ) {
        let tx: string = ''
        let link: string = ''
        try {
          commit('setSigning', true)
          const signData = state.signData as SignData<MethodNameTypeV2, any, any>
          const chainId = signData.chainId || 4
          const contract: LaborXContractV2 = await getLaborXContractV2Async({ chainId: state.signData?.chainId || 4 })
          await BackendTxDetailsV2[signData.methodName](signData.backendParams)
          const encodedAbi = contract.methodSwitch(signData.methodName, {
            ...state.signData?.methodArgs || {},
            mode: 'encodeABI',
            value: state.signData?.payableAmount || '0',
          }) as string
          const feeDetail: PaymentDetail | undefined = (state.signData?.paymentDetails || [])
            .find((item: PaymentDetail) => item.type === PaymentDetailsTypes.Fee)
          const gasLimit: number = feeDetail?.gasLimit?.toNumber() || 0
          const { eventEmitter } = await txSend({
            walletGroup: state.signData?.wallet.group || WalletGroup.Metamask,
            chainId,
            from: state.signData?.wallet.address || '',
            to: contract.contractInstance.options.address,
            value: state.signData?.payableAmount || '0',
            encodedAbi,
            gasPrice: state.signData?.gasPrice || '0',
            gasLimit
          })
          const deferred = new Deferred<string>()
          eventEmitter
            .on('transactionHash', (hash: string) => {
              deferred.resolve(hash)
            })
            .on('error', (err: Error) => {
              console.error(err)
              deferred.reject(err)
            })
          tx = await deferred.promise
          link = getTxLink({ chainId: state.signData?.chainId, tx })
          const pendingTx = new PendingTx({
            typeAwait: TypeAwait.FromBackend,
            txId: tx,
            params: {
              blockchain: state.signData?.blockchain,
              scId: state.signData?.backendParams?.scId,
              txId: tx,
              // @ts-ignore
              event: getSuccessEventNameByMethodName(signData.methodName)
            },
            title: 'Transaction',
            text: `Waiting for <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a> confirmation from the network`, // eslint-disable-line
          })
          await dispatch('pendingTxs/addAndAwaitTx', pendingTx, { root: true })
          dispatch('snacks/deleteSnackbar', tx, { root: true })
          await dispatch('ui/closeModal', {}, { root: true })
          state?.signData?.successCb(tx, signData)
        } catch (err) {
          console.error(err)
          dispatch('snacks/deleteSnackbar', tx, { root: true })
          const revertReason = extractRevert(err)
          dispatch('snacks/openSnackbar', {
            id: uniqueId(),
            type: SnackTypes.FAILURE,
            title: 'Transaction failure',
            text: ![undefined, ''].includes(revertReason)
              ? `Transaction failed. Reason: ${revertReason}. Please try again.`
              : `Unsuccessful <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a>`
          }, { root: true })
        } finally {
          commit('setSigning', false)
        }
      },
      async signTronV2 (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch },
      ) {
        let txId: string = ''
        let link: string = ''
        try {
          commit('setSigning', true)
          const signData = state.signData as SignData<MethodNameTypeV2, any, any>
          const contract: LaborXContractTronV2 = await getLaborXContractTronAsync(ContractType.WriteWithTronLink)
          await BackendTxDetailsV2[signData.methodName](signData.backendParams)
          txId = await contract.methodSwitch(state.signData?.methodName, {
            ...state.signData?.methodArgs || {},
            value: state.signData?.payableAmount || '0',
          }) as string
          link = getTxLinkTron({ tx: txId })
          const pendingTx = new PendingTx({
            typeAwait: TypeAwait.FromBackend,
            txId,
            params: {
              blockchain: state.signData?.blockchain,
              scId: state.signData?.backendParams?.scId,
              txId,
              // @ts-ignore
              event: getSuccessEventNameByMethodName(signData.methodName)
            },
            title: 'Transaction',
            text: `Waiting for <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a> confirmation from the network`, // eslint-disable-line
          })
          await dispatch('pendingTxs/addAndAwaitTx', pendingTx, { root: true })
          dispatch('snacks/deleteSnackbar', txId, { root: true })
          await dispatch('ui/closeModal', {}, { root: true })
          state?.signData?.successCb(txId, signData)
        } catch (err) {
          console.error(err)
          dispatch('snacks/deleteSnackbar', txId, { root: true })
          const revertReason = extractRevert(err)
          dispatch('snacks/openSnackbar', {
            id: uniqueId(),
            type: SnackTypes.FAILURE,
            title: 'Transaction failure',
            text: ![undefined, ''].includes(revertReason)
              ? `Transaction failed. Reason: ${revertReason}. Please try again.`
              : `Unsuccessful <a href="${link}" target="_blank" rel="noopener nofollow" style="text-decoration:none;">transaction</a>`
          }, { root: true })
        } finally {
          commit('setSigning', false)
        }
      },
      async destroyStore (
        { state, commit, dispatch }: { state: ISignState, commit: Commit, dispatch: Dispatch },
      ) {
        switch (state.signData?.wallet.group) {
          case WalletGroup.Metamask:
            await dispatch('destroyMetamask')
            break
          case WalletGroup.WalletConnect:
            await dispatch('destroyWalletConnect')
            break
        }
        commit('resetState')
      },
    },
  })
}

export default signProcess
