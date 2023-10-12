import BigNumber from 'bignumber.js'
import { Commit, Dispatch, Module } from 'vuex'
import Currency from '@/models-ts/Currency'
import CreateContractSignDataV2 from '@/models-ts/sign-process/CreateContractSignDataV2'
import LaborXContractV1, {
  getLaborXContractV1Async,
  IPayToFreelancerParamsV1,
  IReturnFundsToCustomerParamsV1
} from '@/servicies-ts/blockchain/laborx-contract-v1'
import PaymentDetail from '@/models-ts/sign-process/PaymentDetail'
import SignData, {
  IBackendParamsPayToFreelancer,
  IBackendParamsReturnFundsToCustomer,
  TypeSignData
} from '@/models-ts/sign-process/SignData'
import { getDateFromString } from '@/utils/date'
import {
  getPaymentDetailsPayToFreelancerV1,
  getPaymentDetailsReturnFundsToCustomerV1
} from '@/servicies-ts/pay-details/pay-details-lx-v1'
import Wallet from '@/models-ts/Wallet'
import { Blockchain, getChainIdByBlockchain, ChainId, WalletGroup, getNameByWalletGroup, EVM_BLOCKCHAIN } from '@/constants-ts/blockchain'
import { CURRENCY_FIELD_BACKEND_ID, CURRENCY_FIELD_BACKEND_NAME } from '@/constants-ts/currency'
import { SERVICE_DETAILS } from '@/constants-ts/routes'
import { TIME_HOURLY } from '@/constants/backend/service'
import { getCurrency } from '@/utils/currency'
import { formatCurrency } from '@/utils/moneyFormat'
import { getBalanceErrors } from '@/utils-ts/contract'
import { IServicesListState } from './types'
import { ContractVersion } from '@/constants-ts/contracts'
import LaborXContractV2, {
  getLaborXContractV2Async,
  IPayToFreelancerParamsV2,
  IRefundToCustomerByCustomerParamsV2
} from '@/servicies-ts/blockchain/laborx-contract-v2'
import {
  getPaymentDetailsPayToFreelancerV2,
  getPaymentDetailsRefundToCustomerByCustomerV2
} from '@/servicies-ts/pay-details/pay-details-lx-v2'
import CreateContractSignDataV1 from '@/models-ts/sign-process/CreateContractSignDataV1'
import { getLaborXContractTronAsync } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'
import { getBalanceErrors as getBalanceErrorsTron } from '@/utils-ts/tron/contract'
import { SnackTypes } from '@/constants-ts/SnackTypes'

const getInitialState = (): IServicesListState => ({
  createContractLoading: {},
  payToFreelancerLoading: {},
  returnFundsToCustomerLoading: {},
})

const gig = (): Module<IServicesListState, any> => {
  return ({
    namespaced: true,
    state: getInitialState(),
    mutations: {
      setCreateContractLoading: (state: IServicesListState, {
        scId,
        loading = true
      }: { scId: string, loading: boolean }) => {
        state.createContractLoading = {
          ...state.createContractLoading,
          [scId]: loading,
        }
      },
      setPayToFreelancerLoading: (state: IServicesListState, {
        scId,
        loading = true
      }: { scId: string, loading: boolean }) => {
        state.payToFreelancerLoading = {
          ...state.payToFreelancerLoading,
          [scId]: loading,
        }
      },
      setReturnFundsToCustomerLoading: (state: IServicesListState, {
        scId,
        loading = true
      }: { scId: string, loading: boolean }) => {
        state.returnFundsToCustomerLoading = {
          ...state.returnFundsToCustomerLoading,
          [scId]: loading,
        }
      },
    },
    actions: {
      async signCreateContractV1 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { gig, successSign }: { gig: any, successSign: () => void }
      ) {
        const scId = gig.sc_id
        commit('setCreateContractLoading', { scId })
        const preferredCurrencies = gig.preferredCurrencies
          .map((item: any) => getCurrency({
            blockchain: item.blockchain,
            field: CURRENCY_FIELD_BACKEND_ID,
            value: item.currency,
          }))
        const wallet: Wallet = rootState.user.wallet
        const rates: any = await dispatch('app/getRates', null, { root: true })
        const amountUsd = new BigNumber(gig.rate).multipliedBy(gig.time_type === TIME_HOURLY ? gig.hours : 1)
        const freelancer = {
          id: gig.freelancerProfile.id,
          avatar: gig.freelancerProfile.avatar,
          name: gig.freelancerProfile.name,
          type: gig.freelancerProfile.type,
          wallet: gig.freelancer_wallet,
        }

        const signData = await CreateContractSignDataV1.createInstance({
          version: ContractVersion.v1,
          scId,
          preferredCurrencies,
          deadline: gig.deadline,
          wallet,
          rates,
          amountUsd,
          freelancer,
          gigOfferId: gig.id,
          name: gig.name,
          detailsRoute: {
            name: SERVICE_DETAILS,
            params: { id: gig.gig_id, slug: gig.slug }
          },
          successCb: () => {
            successSign()
          },
          errorCb: () => {
          }
        })
        const chainId = getChainIdByBlockchain(signData.currency.blockchain) // Network[signData.currency.blockchain]
        const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
        await dispatch('signProcess/init', { signData, contract }, { root: true })
        commit('setCreateContractLoading', { scId: gig.sc_id, loading: false })
      },
      async signCreateContractV2 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { gig, successSign, cancelSign }: { gig: any, successSign: () => void, cancelSign: () => void }
      ) {
        const scId = gig.sc_id
        commit('setCreateContractLoading', { scId })
        const preferredCurrencies = gig.preferredCurrencies
          .map((item: any) => getCurrency({
            blockchain: item.blockchain,
            field: CURRENCY_FIELD_BACKEND_ID,
            value: item.currency,
          })).filter(Boolean)
        if (
          preferredCurrencies.some((currency: Currency) => currency.blockchain === Blockchain.Tron) &&
          // eslint-disable-next-line max-len
          !preferredCurrencies.some((currency: Currency) => EVM_BLOCKCHAIN.includes(currency.blockchain)) &&
          !rootState.user.wallets.some((wallet: Wallet) => wallet.group === WalletGroup.TronLink)
        ) {
          dispatch('snacks/openSnackbar', {
            id: 'Wallet',
            type: SnackTypes.FAILURE,
            title: 'Wallet',
            text: 'You must have a Tron wallet to interact with the Tron network.',
          }, { root: true })
          commit('setCreateContractLoading', { scId: gig.sc_id, loading: false })
        }
        const freelancerWallet = (gig.freelancerWallets || [])
          .find((wallet: Wallet) => wallet.address.toLowerCase() === gig.freelancer_wallet.toLowerCase())
        let wallet: Wallet
        const customerDefaultWallet: Wallet = rootState.user.wallet
        if (freelancerWallet.group === WalletGroup.TronLink) {
          if (customerDefaultWallet.group === WalletGroup.TronLink) {
            wallet = customerDefaultWallet
          } else {
            wallet = rootState.user.wallets.find((item: Wallet) => item.group === WalletGroup.TronLink)
          }
        } else {
          if (customerDefaultWallet.group !== WalletGroup.TronLink) {
            wallet = customerDefaultWallet
          } else {
            wallet = rootState.user.wallets.find((item: Wallet) => item.group !== WalletGroup.TronLink)
          }
        }
        const rates: any = await dispatch('app/getRates', null, { root: true })
        const amountUsd = new BigNumber(gig.rate).multipliedBy(gig.time_type === TIME_HOURLY ? gig.hours : 1)
        const freelancer = {
          id: gig.freelancerProfile.id,
          avatar: gig.freelancerProfile.avatar,
          name: gig.freelancerProfile.name,
          type: gig.freelancerProfile.type,
          wallet: gig.freelancer_wallet,
          avgReviews: gig.freelancerProfile.avgReviews,
          reviewsCount: gig.freelancerProfile.reviewsCount,
        }
        const signData = await CreateContractSignDataV2.createInstance({
          version: ContractVersion.v2,
          freelancerWallets: gig.freelancerWallets,
          freelancerWallet,
          scId,
          preferredCurrencies,
          deadline: gig.deadline,
          wallet,
          rates,
          amountUsd,
          freelancer,
          gigOfferId: gig.id,
          name: gig.name,
          detailsRoute: {
            name: SERVICE_DETAILS,
            params: { id: gig.gig_id, slug: gig.slug }
          },
          successCb: () => {
            successSign()
          },
          errorCb: () => {},
          cancelCb: cancelSign,
        })
        await dispatch('signProcess/init', { signData }, { root: true })
        commit('setCreateContractLoading', { scId: gig.sc_id, loading: false })
      },
      async signPayToFreelancerV1 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { gig, successSign }: { gig: any, successSign: (params: {}) => void }
      ) {
        commit('setPayToFreelancerLoading', { scId: gig.sc_id })
        const blockchain: Blockchain = gig.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_NAME,
          value: gig.currency
        })!
        const chainId = Number(ChainId[currency.blockchain])
        const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
        const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
        const wallet: Wallet = rootState.user.wallets.find(
          (item: Wallet) => item.address.toLowerCase() === gig.customerWallet.toLowerCase()
        )
        const methodArgs: IPayToFreelancerParamsV1 = {
          postfix,
          mode: 'encodeABI',
          from: gig.customerWallet,
          contractId: gig.sc_id,
        }
        const gasPrice: string = await contract.web3Instance.eth.getGasPrice()
        const paymentDetails: PaymentDetail[] = await getPaymentDetailsPayToFreelancerV1(
          methodArgs,
          contract,
          currency,
          gasPrice
        )
        const backendParams: IBackendParamsPayToFreelancer = {
          postfix,
          blockchain: currency.blockchain,
          gigJobId: gig?.job?.id,
          gigOfferId: gig?.id,
          scId: gig?.sc_id,
        }
        const balance = `${formatCurrency(gig.job.escrow_balance, {
          blockchain: gig.blockchain,
          currency: gig.currency
        })} ${gig.currency}`
        const { errors } = await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const freelancer = {
          id: gig.freelancerProfile.id,
          avatar: gig.freelancerProfile.avatar,
          name: gig.freelancerProfile.name,
          type: gig.freelancerProfile.type,
          avgReviews: gig.freelancerProfile.avgReviews,
          reviewsCount: gig.freelancerProfile.reviewsCount,
          wallet: gig.freelancer_wallet,
        }
        const signData = new SignData<'payToFreelancer', IPayToFreelancerParamsV1, IBackendParamsPayToFreelancer>({
          version: ContractVersion.v1,
          type: TypeSignData.PayContract,
          name: gig.name,
          title: 'Pay to Freelancer',
          description: `Paying out funds to a freelancer from an escrow.<br>Escrow balance: <b>${balance}</b><br>`,
          freelancer,
          createdAt: getDateFromString(gig.job.created_at),
          deadline: gig.deadline,
          escrowBalance: gig.job.escrow_balance,
          wallet,
          walletChangeable: false,
          blockchain,
          currency,
          payableAmount: '',
          contractName: 'LaborXContractV1',
          paymentDetails,
          contractLink: contract.contractLink(blockchain),
          gasPrice,
          errors,
          backendParams,
          methodName: 'payToFreelancer',
          methodArgs,
          async setGasPrice (gasPrice: string) {
            const self = this as SignData<'payToFreelancer', IPayToFreelancerParamsV1, IBackendParamsPayToFreelancer>
            self.gasPrice = gasPrice
            const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
            self.paymentDetails = await getPaymentDetailsPayToFreelancerV1(
              methodArgs,
              contract,
              currency,
              gasPrice
            )
            const { errors } = await getBalanceErrors(self.currency!, self.wallet!, self.paymentDetails, new BigNumber(0))
            self.errors = errors
          },
          successCb: (tx, signData) => {
            successSign({
              tx,
              walletName: getNameByWalletGroup(signData.wallet.group),
              currency: signData.currency,
              blockchain: signData.blockchain,
            })
          },
          errorCb: () => {},
          cancelCb: () => {},
        })
        await dispatch('signProcess/init', { signData, contract }, { root: true })
        commit('setPayToFreelancerLoading', { scId: gig.sc_id, loading: false })
      },
      async signPayToFreelancerV2 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { gig, successSign }: { gig: any, successSign: (params: {}) => void }
      ) {
        commit('setPayToFreelancerLoading', { scId: gig.sc_id })
        const blockchain: Blockchain = gig.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_NAME,
          value: gig.currency
        })!
        const contract: any = blockchain === Blockchain.Tron
          ? await getLaborXContractTronAsync()
          : await getLaborXContractV2Async({ chainId: Number(ChainId[currency.blockchain]) })
        const wallet: Wallet = rootState.user.wallets.find(
          (item: Wallet) => item.address.toLowerCase() === gig.customerWallet.toLowerCase()
        )
        const methodArgs: IPayToFreelancerParamsV2 = {
          mode: 'encodeABI',
          from: gig.customerWallet,
          contractId: gig.sc_id,
        }
        let gasPrice: string | null = null
        let paymentDetails: PaymentDetail[] = []
        if (blockchain !== Blockchain.Tron) {
          gasPrice = await contract.web3Instance.eth.getGasPrice()
          paymentDetails = await getPaymentDetailsPayToFreelancerV2(
            methodArgs,
            contract,
            currency,
            gasPrice!
          )
        }
        const backendParams: IBackendParamsPayToFreelancer = {
          blockchain: currency.blockchain,
          gigJobId: gig?.job?.id,
          gigOfferId: gig?.id,
          scId: gig?.sc_id,
        }
        const balance = `${formatCurrency(gig.job.escrow_balance, {
          blockchain: gig.blockchain,
          currency: gig.currency
        })} ${gig.currency}`
        const { errors } = blockchain === Blockchain.Tron
          ? await getBalanceErrorsTron(currency, wallet, paymentDetails, new BigNumber(0))
          : await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const freelancer = {
          id: gig.freelancerProfile.id,
          avatar: gig.freelancerProfile.avatar,
          name: gig.freelancerProfile.name,
          type: gig.freelancerProfile.type,
          avgReviews: gig.freelancerProfile.avgReviews,
          reviewsCount: gig.freelancerProfile.reviewsCount,
          wallet: gig.freelancer_wallet,
        }
        const signData = new SignData<'payToFreelancer', IPayToFreelancerParamsV2, IBackendParamsPayToFreelancer>({
          version: ContractVersion.v2,
          type: TypeSignData.PayContract,
          name: gig.name,
          title: 'Pay to Freelancer',
          description: `Paying out funds to a freelancer from an escrow.<br>Escrow balance: <b>${balance}</b><br>`,
          freelancer,
          createdAt: getDateFromString(gig.job.created_at),
          deadline: gig.deadline,
          escrowBalance: gig.job.escrow_balance,
          wallet,
          walletChangeable: false,
          blockchain,
          currency,
          payableAmount: '',
          contractName: 'LaborXContractV2',
          paymentDetails,
          contractLink: contract.contractLink(blockchain),
          gasPrice,
          errors,
          backendParams,
          methodName: 'payToFreelancer',
          methodArgs,
          async setGasPrice (gasPrice: string) {
            const self = this as SignData<'payToFreelancer', IPayToFreelancerParamsV2, IBackendParamsPayToFreelancer>
            self.gasPrice = gasPrice
            const contract: LaborXContractV2 = await getLaborXContractV2Async({ chainId: Number(ChainId[self.currency.blockchain]) })
            self.paymentDetails = await getPaymentDetailsPayToFreelancerV2(
              methodArgs,
              contract,
              currency,
              gasPrice
            )
            const { errors } = await getBalanceErrors(self.currency!, self.wallet!, self.paymentDetails, new BigNumber(0))
            self.errors = errors
          },
          successCb: (tx, signData) => {
            successSign({
              tx,
              walletName: getNameByWalletGroup(signData.wallet.group),
              currency: signData.currency,
              blockchain: signData.blockchain,
            })
          },
          errorCb: () => {},
          cancelCb: () => {},
        })
        await dispatch('signProcess/init', { signData, contract }, { root: true })
        commit('setPayToFreelancerLoading', { scId: gig.sc_id, loading: false })
      },
      async returnFundsToCustomerV1 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { gig, successSign }: { gig: any, successSign: () => void }
      ) {
        commit('setReturnFundsToCustomerLoading', { scId: gig.sc_id })
        const blockchain: Blockchain = gig.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_NAME,
          value: gig.currency
        })!
        const chainId = Number(ChainId[currency.blockchain])
        const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
        const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
        const wallet: Wallet = rootState.user.wallets.find(
          (item: Wallet) => item.address.toLowerCase() === gig.customerWallet.toLowerCase()
        )
        const methodArgs: IReturnFundsToCustomerParamsV1 = {
          postfix,
          mode: 'encodeABI',
          from: gig.customerWallet,
          contractId: gig.sc_id,
        }
        const gasPrice: string = await contract.web3Instance.eth.getGasPrice()
        const paymentDetails: PaymentDetail[] = await getPaymentDetailsReturnFundsToCustomerV1(
          methodArgs,
          contract,
          currency,
          gasPrice
        )
        const backendParams: IBackendParamsReturnFundsToCustomer = {
          postfix,
          blockchain: currency.blockchain,
          gigJobId: gig?.job?.id,
          gigOfferId: gig?.id,
          scId: gig?.sc_id,
        }
        const balance = `${formatCurrency(gig.job.escrow_balance, {
          blockchain: gig.blockchain,
          currency: gig.currency
        })} ${gig.currency}`
        const { errors } = await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const freelancer = {
          id: gig.freelancerProfile.id,
          avatar: gig.freelancerProfile.avatar,
          name: gig.freelancerProfile.name,
          type: gig.freelancerProfile.type,
          avgReviews: gig.freelancerProfile.avgReviews,
          reviewsCount: gig.freelancerProfile.reviewsCount,
          wallet: gig.freelancer_wallet,
        }
        const signData = new SignData<'returnFundsToCustomer', IReturnFundsToCustomerParamsV1, IBackendParamsReturnFundsToCustomer>({
          version: ContractVersion.v1,
          type: TypeSignData.Refund,
          name: gig.name,
          title: 'Refund',
          description: `Cancellation of job and refunds from escrow<br>Escrow balance: <b>${balance}</b><br>`,
          freelancer,
          createdAt: getDateFromString(gig.job.created_at),
          deadline: gig.deadline,
          escrowBalance: gig.job.escrow_balance,
          wallet,
          walletChangeable: false,
          blockchain,
          currency,
          payableAmount: '',
          contractName: 'LaborXContractV1',
          paymentDetails,
          contractLink: contract.contractLink(blockchain),
          gasPrice,
          errors,
          backendParams,
          methodName: 'returnFundsToCustomer',
          methodArgs,
          async setGasPrice (gasPrice: string) {
            const self = this as SignData<'returnFundsToCustomer', IReturnFundsToCustomerParamsV1, IBackendParamsReturnFundsToCustomer>
            self.gasPrice = gasPrice
            const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
            self.paymentDetails = await getPaymentDetailsReturnFundsToCustomerV1(
              methodArgs,
              contract,
              currency,
              gasPrice
            )
            const { errors } = await getBalanceErrors(self.currency!, self.wallet!, self.paymentDetails, new BigNumber(0))
            self.errors = errors
          },
          successCb: () => {
            successSign()
          },
          errorCb: () => {},
          cancelCb: () => {},
        })
        await dispatch('signProcess/init', { signData, contract }, { root: true })
        commit('setReturnFundsToCustomerLoading', { scId: gig.sc_id, loading: false })
      },
      async refundToCustomerByCustomerV2 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { gig, successSign }: { gig: any, successSign: () => void }
      ) {
        commit('setReturnFundsToCustomerLoading', { scId: gig.sc_id })
        const blockchain: Blockchain = gig.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_NAME,
          value: gig.currency
        })!
        const contract: any = blockchain === Blockchain.Tron
          ? await getLaborXContractTronAsync()
          : await getLaborXContractV2Async({ chainId: Number(ChainId[currency.blockchain]) })
        const wallet: Wallet = rootState.user.wallets.find(
          (item: Wallet) => item.address.toLowerCase() === gig.customerWallet.toLowerCase()
        )
        const methodArgs: IRefundToCustomerByCustomerParamsV2 = {
          mode: 'encodeABI',
          from: gig.customerWallet,
          contractId: gig.sc_id,
        }
        let gasPrice: string | null = null
        let paymentDetails: PaymentDetail[] = []
        if (blockchain !== Blockchain.Tron) {
          gasPrice = await contract.web3Instance.eth.getGasPrice()
          paymentDetails = await getPaymentDetailsRefundToCustomerByCustomerV2(
            methodArgs,
            contract,
            currency,
            gasPrice!
          )
        }
        const backendParams: IBackendParamsReturnFundsToCustomer = {
          blockchain: currency.blockchain,
          gigJobId: gig?.job?.id,
          gigOfferId: gig?.id,
          scId: gig?.sc_id,
        }
        const balance = `${formatCurrency(gig.job.escrow_balance, {
          blockchain: gig.blockchain,
          currency: gig.currency
        })} ${gig.currency}`
        const { errors } = blockchain === Blockchain.Tron
          ? await getBalanceErrorsTron(currency, wallet, paymentDetails, new BigNumber(0))
          : await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const freelancer = {
          id: gig.freelancerProfile.id,
          avatar: gig.freelancerProfile.avatar,
          name: gig.freelancerProfile.name,
          type: gig.freelancerProfile.type,
          avgReviews: gig.freelancerProfile.avgReviews,
          reviewsCount: gig.freelancerProfile.reviewsCount,
          wallet: gig.freelancer_wallet,
        }
        const signData =
          new SignData<'refundToCustomerByCustomer', IRefundToCustomerByCustomerParamsV2, IBackendParamsReturnFundsToCustomer>({
            version: ContractVersion.v2,
            type: TypeSignData.Refund,
            name: gig.name,
            title: 'Refund',
            description: `Cancellation of job and refunds from escrow<br>Escrow balance: <b>${balance}</b><br>`,
            freelancer,
            createdAt: getDateFromString(gig.job.created_at),
            deadline: gig.deadline,
            escrowBalance: gig.job.escrow_balance,
            wallet,
            walletChangeable: false,
            blockchain,
            currency,
            payableAmount: '',
            contractName: 'LaborXContractV2',
            paymentDetails,
            contractLink: contract.contractLink(blockchain),
            gasPrice,
            errors,
            backendParams,
            methodName: 'refundToCustomerByCustomer',
            methodArgs,
            async setGasPrice (gasPrice: string) {
              const self =
                this as SignData<'refundToCustomerByCustomer', IRefundToCustomerByCustomerParamsV2, IBackendParamsReturnFundsToCustomer>
              self.gasPrice = gasPrice
              const contract: LaborXContractV2 = await getLaborXContractV2Async({ chainId: Number(ChainId[self.blockchain]) })
              self.paymentDetails = await getPaymentDetailsRefundToCustomerByCustomerV2(
                methodArgs,
                contract,
                currency,
                gasPrice
              )
              const { errors } = await getBalanceErrors(self.currency!, self.wallet!, self.paymentDetails, new BigNumber(0))
              self.errors = errors
            },
            successCb: () => {
              successSign()
            },
            errorCb: () => {},
            cancelCb: () => {},
          })
        await dispatch('signProcess/init', { signData }, { root: true })
        commit('setReturnFundsToCustomerLoading', { scId: gig.sc_id, loading: false })
      }
    },
  })
}

export default gig
