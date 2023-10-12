import BigNumber from 'bignumber.js'
import Vue from 'vue'
import { Commit, Dispatch, Module } from 'vuex'
import { IJobDetailsState } from './types'
import SignData, {
  IBackendParamsPayToFreelancer,
  IBackendParamsReturnFundsToCustomer,
  TypeSignData
} from '@/models-ts/sign-process/SignData'
import CreateContractSignDataV2, { FreelancerSignData } from '@/models-ts/sign-process/CreateContractSignDataV2'
import LoadableModel from '@/models-ts/LoadableModel'
import Job from '@/models-ts/job/Job'
import LaborXContractV1, {
  getLaborXContractV1Async,
  IPayToFreelancerParamsV1,
  IReturnFundsToCustomerParamsV1
} from '@/servicies-ts/blockchain/laborx-contract-v1'
import { getJob, publishJob, unpublishJob } from '@/api/jobs/job'
import { STATUS_DRAFT, STATUS_PUBLISHED } from '@/constants/jobStatuses'
import Wallet from '@/models-ts/Wallet'
import { Blockchain, ChainId, getNameByWalletGroup } from '@/constants-ts/blockchain'
import Currency from '@/models-ts/Currency'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'
import { getBalanceErrors } from '@/utils-ts/contract'
import { getBalanceErrors as getBalanceErrorsTron } from '@/utils-ts/tron/contract'
import {
  getPaymentDetailsPayToFreelancerV1,
  getPaymentDetailsReturnFundsToCustomerV1
} from '@/servicies-ts/pay-details/pay-details-lx-v1'
import { JOB_DETAILS, JOB_DETAILS_BY_ID } from '@/constants-ts/routes'
import { CURRENCIES, CURRENCY_FIELD_BACKEND_ID } from '@/constants-ts/currency'
import { formatCurrency } from '@/utils/moneyFormat'
import { ContractVersion } from '@/constants-ts/contracts'
import { JobModerationStages } from '@/constants-ts/job/jobModerationStages'
import LaborXContractV2, {
  getLaborXContractV2Async,
  IPayToFreelancerParamsV2, IRefundToCustomerByCustomerParamsV2
} from '@/servicies-ts/blockchain/laborx-contract-v2'
import {
  getPaymentDetailsPayToFreelancerV2,
  getPaymentDetailsRefundToCustomerByCustomerV2
} from '@/servicies-ts/pay-details/pay-details-lx-v2'
import CreateContractSignDataV1 from '@/models-ts/sign-process/CreateContractSignDataV1'
import { getLaborXContractTronAsync } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'
import JobApplication from '@/models-ts/job/JobApplication'
import { declineApplicationAsCustomer, readApplications, setApplicationMeta } from '@/api/jobs/applications'
import { JobApplicationStatuses } from '@/constants-ts/job/jobApplicationStatuses'
import MyCustomerJobListItem from '@/models-ts/job/MyCustomerJobListItem'
import { getCurrency } from '@/utils-ts/currencies'

const getInitialState = (): IJobDetailsState => ({
  createContractLoading: {},
  payToFreelancerLoading: {},
  returnFundsToCustomerLoading: {},
  prefetched: false,
  job: new LoadableModel(),
})

const jobDetails = (): Module<IJobDetailsState, any> => {
  return ({
    namespaced: true,
    state: getInitialState(),
    getters: {
      jobId: (state, getters, rootState) => [JOB_DETAILS, JOB_DETAILS_BY_ID].includes(rootState.route.name) && rootState.route.params.id,
      job: (state, getters) => state.job.value && Job.fromServer(state.job.value),
      isLoaded: (state, getters) => state.job.isLoaded,
      isLoading: (state, getters) => state.job.isLoading,
      isCustomer: (state, getters, rootState) => getters.isLoaded && getters.job.customer_id === rootState.user?.id,
      isFreelancer: (state, getters, rootState) => getters.isLoaded && getters.job.freelancer_id === rootState.user?.id,
      isMember: (state, getters, rootState) => {
        if (getters.isLoaded) {
          const ownId = rootState.user?.id
          return ownId && (getters.job.customer_id === ownId || getters.job.freelancer_id === ownId)
        }
      },
    },
    mutations: {
      setApplicationStatus (state: IJobDetailsState, { jobId, appId, status }) {
        if (state.job.value?.id === jobId) {
          const index = (state.job.value.relations.Application || []).findIndex(app => app.id === appId)
          if (index !== -1) {
            state.job.value.relations.Application![index].status = status
          }
        }
      },
      setCreateContractLoading (state: IJobDetailsState, {
        scId,
        loading = true
      }: { scId: string, loading: boolean }) {
        state.createContractLoading = {
          ...state.createContractLoading,
          [scId]: loading,
        }
      },
      setReadApplications (state: IJobDetailsState, { jobId, ids, flag }: { jobId: number, ids: Array<number>, flag: number }) {
        if (state.job.value?.id === jobId) {
          (state.job.value.relations.Application || []).forEach(app => {
            if (ids.includes(app.id)) {
              app.is_read = flag
            }
          })
        }
      },
      setPayToFreelancerLoading: (state: IJobDetailsState, {
        scId,
        loading = true
      }: { scId: string, loading: boolean }) => {
        state.payToFreelancerLoading = {
          ...state.payToFreelancerLoading,
          [scId]: loading,
        }
      },
      setReturnFundsToCustomerLoading: (state: IJobDetailsState, {
        scId,
        loading = true
      }: { scId: string, loading: boolean }) => {
        state.returnFundsToCustomerLoading = {
          ...state.returnFundsToCustomerLoading,
          [scId]: loading,
        }
      },
      resetState (state) {
        Object.assign(state, getInitialState())
      },
      setPrefetched (state, flag) {
        state.prefetched = flag
      },
      beforeReady (state) {
        state.job = new LoadableModel(state.job)
      },
      clearJob (state) {
        state.job = new LoadableModel()
      },
      setJobLoading (state) {
        state.job.loading()
      },
      setJobLoaded (state, job) {
        state.job.loaded(job)
      },
      setPublishStatus (state, { id, status, moderation_stage }) {
        if (state.job.value?.id === id) {
          state.job.value.status = status
          if (moderation_stage in JobModerationStages) {
            state.job.value.moderation_stage = moderation_stage
          }
        }
      },
      setApplicationMeta (state, { jobId, applicationId, meta }) {
        if (state.job.value?.id === jobId) {
          const applications = state.job.value.relations.Application
          if (applications) {
            const i = applications.findIndex(app => app.id === applicationId)
            if (i !== -1) {
              applications.splice(i, 1, { ...applications[i], tabs_meta: meta })
            }
          }
        }
      },
    },
    actions: {
      async load ({ commit, getters, state }, { slug, id, withLoading = true }) {
        if (withLoading) {
          commit('setJobLoading', id)
        }
        let job
        if (slug) {
          job = await getJob(`${slug}-${id}`)
        } else {
          job = await getJob(id)
        }
        commit('setJobLoaded', job)
      },
      async publish ({ commit }, id) {
        const job = await publishJob(id)
        commit('setPublishStatus', { id, status: STATUS_PUBLISHED, moderation_stage: job.moderation_stage })
      },
      async unpublish ({ state, commit }, id) {
        await unpublishJob(id)
        const job = state.job.value
        commit('setPublishStatus', { id, status: STATUS_DRAFT })
        const applications = (job?.relations.Application || [])
        for (const app of applications) {
          commit('setApplicationStatus', { jobId: id, appId: app.id, status: JobApplicationStatuses.ARCHIVED })
        }
      },
      async declineApplication ({ commit }, application: JobApplication) {
        await declineApplicationAsCustomer(application.id)
        commit('setApplicationStatus', { jobId: application.job.id, appId: application.id, status: JobApplicationStatuses.ARCHIVED })
      },
      async readApplications ({ commit }, { jobId, ids }) {
        await readApplications(ids)
        commit('setReadApplications', { jobId, ids, flag: 1 })
      },
      async signCreateContractV1 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { params, successSign }:
          {
            params: {
              name: string,
              rate: BigNumber,
              deadline: number,
              scId: string,
              id: number,
              slug: string,
              freelancer: FreelancerSignData
            },
            successSign: () => void
          }
      ) {
        const scId = params.scId
        commit('setCreateContractLoading', { scId })
        const wallet: Wallet = rootState.user.wallet
        const rates: any = await dispatch('app/getRates', null, { root: true })
        const signData = await CreateContractSignDataV1.createInstance({
          version: ContractVersion.v1,
          scId,
          preferredCurrencies: CURRENCIES,
          deadline: params.deadline,
          wallet,
          rates,
          amountUsd: params.rate,
          freelancer: params.freelancer,
          jobId: params.id,
          name: params.name,
          detailsRoute: {
            name: JOB_DETAILS,
            params: { id: params.id, slug: params.slug }
          },
          successCb: () => {
            successSign()
          },
          errorCb: () => {
          }
        })
        const chainId = Number(ChainId[signData.currency.blockchain])
        const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
        await dispatch('signProcess/init', { signData, contract }, { root: true })
        commit('setCreateContractLoading', { scId, loading: false })
      },
      async signCreateContractV2 (
        { commit, dispatch, rootState }: { commit: Commit, dispatch: Dispatch, rootState: any },
        { version, params, successSign, cancelSign }:
          {
            version: ContractVersion,
            params: {
              freelancerWallets: Wallet[],
              name: string,
              rate: BigNumber,
              deadline: number,
              scId: string,
              id: number,
              slug: string,
              freelancer: FreelancerSignData
            },
            successSign: () => void,
            cancelSign: () => void
          }
      ) {
        const scId = params.scId
        commit('setCreateContractLoading', { scId })
        const wallet: Wallet = rootState.user.wallet
        const rates: any = await dispatch('app/getRates', null, { root: true })
        const signData = await CreateContractSignDataV2.createInstance({
          version: ContractVersion.v2,
          freelancerWallets: params.freelancerWallets,
          scId,
          preferredCurrencies: CURRENCIES,
          deadline: params.deadline,
          wallet,
          rates,
          amountUsd: params.rate,
          freelancer: params.freelancer,
          jobId: params.id,
          name: params.name,
          detailsRoute: {
            name: JOB_DETAILS,
            params: { id: params.id, slug: params.slug }
          },
          successCb: () => {
            successSign()
          },
          errorCb: () => {},
          cancelCb: cancelSign,
        })
        await dispatch('signProcess/init', { signData }, { root: true })
        commit('setCreateContractLoading', { scId, loading: false })
      },
      async signPayToFreelancerV1 (
        { rootState, dispatch, commit }: { rootState: any, dispatch: Dispatch, commit: Commit },
        { job, successSign }: { job: any, successSign: (params: {}) => void }
      ) {
        commit('setPayToFreelancerLoading', { scId: job.sc_id })
        const blockchain: Blockchain = job.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_ID,
          value: job.currency
        })!
        const chainId = Number(ChainId[currency.blockchain])
        const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
        const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
        const wallet: Wallet = rootState.user.wallets
          .find((item: Wallet) => item.address?.toLowerCase() === job.customer_wallet?.toLowerCase())
        const methodArgs: IPayToFreelancerParamsV1 = {
          postfix,
          mode: 'encodeABI',
          from: job.customer_wallet,
          contractId: job.sc_id,
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
          jobId: job?.id,
          scId: job?.sc_id,
        }
        const balance = `${formatCurrency(new BigNumber(job.escrow_balance), {
          divider: currency.decimalsDivider
        })} ${currency.name}`
        const escrowBalance = new BigNumber(job.escrow_balance).dividedBy(currency.decimalsDivider)
        const { errors } = await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const signData = new SignData<'payToFreelancer', IPayToFreelancerParamsV1, IBackendParamsPayToFreelancer>({
          version: ContractVersion.v1,
          type: TypeSignData.PayContract,
          name: job.name,
          title: 'Pay to Freelancer',
          description: `Paying out funds to a freelancer from an escrow.<br>Escrow balance: <b>${balance}</b><br>`,
          escrowBalance,
          createdAt: job.inProgressAt,
          deadline: job.estimate,
          wallet,
          walletChangeable: false,
          blockchain,
          currency,
          payableAmount: '',
          contractName: 'LaborXContractV1',
          paymentDetails,
          contractLink: contract.contractLink(blockchain),
          freelancer: job.freelancer,
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
        commit('setPayToFreelancerLoading', { scId: job.sc_id, loading: false })
      },
      async signPayToFreelancerV2 (
        { rootState, dispatch, commit }: { rootState: any, dispatch: Dispatch, commit: Commit },
        { job, successSign }: { job: MyCustomerJobListItem | Job, successSign: (params: {}) => void }
      ) {
        commit('setPayToFreelancerLoading', { scId: job.sc_id })
        const blockchain: Blockchain = job.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_ID,
          value: job.currency
        })!
        const contract: any = job.blockchain === Blockchain.Tron
          ? await getLaborXContractTronAsync()
          : await getLaborXContractV2Async({ chainId: Number(ChainId[currency.blockchain]) })
        const wallet: Wallet = rootState.user.wallets
          .find((item: Wallet) => item.address?.toLowerCase() === job.customer_wallet?.toLowerCase())
        const methodArgs: IPayToFreelancerParamsV2 = {
          mode: 'encodeABI',
          from: job.customer_wallet!,
          contractId: job.sc_id,
        }
        let gasPrice: string | null = null
        let paymentDetails: PaymentDetail[] = []
        if (job.blockchain !== Blockchain.Tron) {
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
          jobId: job.id,
          scId: job.sc_id,
        }
        const balance = `${formatCurrency(new BigNumber(job.escrow_balance || 0), {
          divider: currency.decimalsDivider
        })} ${currency.name}`
        const escrowBalance = new BigNumber(job.escrow_balance || 0).dividedBy(currency.decimalsDivider)
        console.log(job.escrow_balance)
        const { errors } = job.blockchain === Blockchain.Tron
          ? await getBalanceErrorsTron(currency, wallet, paymentDetails, new BigNumber(0))
          : await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const signData = new SignData<'payToFreelancer', IPayToFreelancerParamsV2, IBackendParamsPayToFreelancer>({
          version: ContractVersion.v2,
          type: TypeSignData.PayContract,
          name: job.name,
          title: 'Pay to Freelancer',
          description: `Paying out funds to a freelancer from an escrow.<br>Escrow balance: <b>${balance}</b><br>`,
          escrowBalance,
          createdAt: job.inProgressAt!,
          deadline: job.estimate!,
          wallet,
          // @ts-ignore
          freelancer: job.freelancer,
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
        await dispatch('signProcess/init', { signData }, { root: true })
        commit('setPayToFreelancerLoading', { scId: job.sc_id, loading: false })
      },
      async returnFundsToCustomerV1 ({ rootState, dispatch, commit }, { job, successSign }) {
        commit('setReturnFundsToCustomerLoading', { scId: job.sc_id })
        const blockchain: Blockchain = job.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_ID,
          value: job.currency
        })!
        const chainId = Number(ChainId[currency.blockchain])
        const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
        const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
        const wallet: Wallet = rootState.user.wallets
          .find((item: Wallet) => item.address?.toLowerCase() === job.customer_wallet?.toLowerCase())
        const methodArgs: IReturnFundsToCustomerParamsV1 = {
          postfix,
          mode: 'encodeABI',
          from: job.customer_wallet,
          contractId: job.sc_id,
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
          jobId: job?.id,
          scId: job?.sc_id,
        }
        const balance = `${formatCurrency(new BigNumber(job.escrow_balance), {
          divider: currency.decimalsDivider
        })} ${currency.name}`
        const escrowBalance = new BigNumber(job.escrow_balance).dividedBy(currency.decimalsDivider)
        const { errors } = await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const signData = new SignData<'returnFundsToCustomer', IReturnFundsToCustomerParamsV1, IBackendParamsReturnFundsToCustomer>({
          version: ContractVersion.v1,
          type: TypeSignData.Refund,
          name: job.name,
          title: 'Refund',
          description: `Cancellation of job and refunds from escrow<br>Escrow balance: <b>${balance}</b><br>`,
          escrowBalance,
          createdAt: job.inProgressAt,
          deadline: job.estimate,
          freelancer: job.freelancer,
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
        commit('setReturnFundsToCustomerLoading', { scId: job.sc_id, loading: false })
      },
      async refundToCustomerByCustomerV2 ({ rootState, dispatch, commit }, { job, successSign }) {
        commit('setReturnFundsToCustomerLoading', { scId: job.sc_id })
        const blockchain: Blockchain = job.blockchain
        const currency: Currency = getCurrency({
          blockchain: blockchain,
          field: CURRENCY_FIELD_BACKEND_ID,
          value: job.currency
        })!
        const contract: any = job.blockchain === Blockchain.Tron
          ? await getLaborXContractTronAsync()
          : await getLaborXContractV2Async({ chainId: Number(ChainId[currency.blockchain]) })
        const wallet: Wallet = rootState.user.wallets
          .find((item: Wallet) => item.address?.toLowerCase() === job.customer_wallet?.toLowerCase())
        const methodArgs: IRefundToCustomerByCustomerParamsV2 = {
          mode: 'encodeABI',
          from: job.customer_wallet,
          contractId: job.sc_id,
        }
        let gasPrice: string | null = null
        let paymentDetails: PaymentDetail[] = []
        if (job.blockchain !== Blockchain.Tron) {
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
          jobId: job?.id,
          scId: job?.sc_id,
        }
        const balance = `${formatCurrency(new BigNumber(job.escrow_balance), {
          divider: currency.decimalsDivider
        })} ${currency.name}`
        const escrowBalance = new BigNumber(job.escrow_balance).dividedBy(currency.decimalsDivider)
        const { errors } = job.blockchain === Blockchain.Tron
          ? await getBalanceErrorsTron(currency, wallet, paymentDetails, new BigNumber(0))
          : await getBalanceErrors(currency, wallet, paymentDetails, new BigNumber(0))
        const signData =
          new SignData<'refundToCustomerByCustomer', IRefundToCustomerByCustomerParamsV2, IBackendParamsReturnFundsToCustomer>({
            version: ContractVersion.v2,
            name: job.name,
            type: TypeSignData.Refund,
            title: 'Refund',
            description: `Cancellation of job and refunds from escrow<br>Escrow balance: <b>${balance}</b><br>`,
            escrowBalance,
            createdAt: job.inProgressAt,
            deadline: job.estimate,
            freelancer: job.freelancer,
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
              const contract: LaborXContractV2 = await getLaborXContractV2Async({ chainId: Number(ChainId[self.currency.blockchain]) })
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
        commit('setReturnFundsToCustomerLoading', { scId: job.sc_id, loading: false })
      },
      async setApplicationMeta ({ state, commit }, { jobId, applicationId, meta }) {
        commit('setApplicationMeta', { jobId, applicationId, meta })
        const oldMeta = state.job.value?.relations?.Application?.find(app => app.id === applicationId)?.tabs_meta
        try {
          await setApplicationMeta(applicationId, meta)
        } catch (e) {
          commit('setApplicationMeta', { jobId, applicationId, oldMeta })
          throw e
        }
      },
    },
  })
}

export default jobDetails
