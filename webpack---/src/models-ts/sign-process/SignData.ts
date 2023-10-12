import Wallet from '@/models-ts/Wallet'
import { Blockchain, ChainId } from '@/constants-ts/blockchain'
import Currency from '@/models-ts/Currency'
import {
  ICreateContractParamsV1,
  IPayToFreelancerParamsV1,
  IReturnFundsToCustomerParamsV1
} from '@/servicies-ts/blockchain/laborx-contract-v1'
import {
  ICreateContractParamsV2,
  IPayToFreelancerParamsV2,
  IRefundToCustomerByCustomerParamsV2,
  IRefundToCustomerByFreelancerParamsV2,
} from '@/servicies-ts/blockchain/laborx-contract-v2'
import PaymentDetail from '@/models-ts/sign-process/PaymentDetail'
import BigNumber from 'bignumber.js'
import { ContractVersion } from '@/constants-ts/contracts'
import { FreelancerSignData } from './FreelancerSignData'

export interface IBackendParamsCreateContract {
  postfix?: 'Eth' | 'Erc20',
  gigOfferId?: string,
  jobId?: number,
  scId?: string,
  blockchain: Blockchain,
  customerWallet: string,
  freelancerWallet?: string,
  backendCurrencyId: number,
  deadline: number,
}

export interface IBackendParamsPayToFreelancer {
  postfix?: 'Eth' | 'Erc20',
  blockchain: Blockchain,
  gigOfferId?: string,
  gigJobId?: string,
  jobId?: number,
  scId?: string,
}

export interface IBackendParamsReturnFundsToCustomer {
  postfix?: 'Eth' | 'Erc20',
  blockchain: Blockchain,
  gigOfferId?: string,
  gigJobId?: string,
  jobId?: string,
  scId?: string,
}

export enum TypeSignData {
  CreateContract = 'createContract',
  PayContract = 'payContract',
  Refund = 'refund',
}

export type MethodNameTypeV1 = 'createContract' | 'payToFreelancer' | 'returnFundsToCustomer'
export type MethodNameTypeV2 = 'createContract' | 'payToFreelancer'| 'refundToCustomerByFreelancer' | 'refundToCustomerByCustomer'
export type MethodNameType = MethodNameTypeV1 | MethodNameTypeV2
export type MethodArgsType = ICreateContractParamsV1 | IPayToFreelancerParamsV1 | IReturnFundsToCustomerParamsV1 |
  ICreateContractParamsV2 | IPayToFreelancerParamsV2 | IRefundToCustomerByCustomerParamsV2 | IRefundToCustomerByFreelancerParamsV2
export type BackendParamsType = IBackendParamsCreateContract | IBackendParamsPayToFreelancer | IBackendParamsReturnFundsToCustomer

export default class SignData<MethodNameType, MethodArgsType, BackendParamsType> {
  version: ContractVersion
  type: TypeSignData
  name: string
  title: string
  description: string
  wallet: Wallet
  walletChangeable: boolean
  blockchain: Blockchain
  currency: Currency
  payableAmount: string
  amountAndFee?: BigNumber
  freelancer?: FreelancerSignData
  freelancerWallet?: Wallet
  deadline: number
  createdAt?: string | Date
  escrowBalance?: BigNumber
  currencyOptions?: Currency[]
  paymentDetails: PaymentDetail[]
  contractName: 'LaborXContractV1' | 'LaborXContractV2'
  contractLink?: string
  methodName: MethodNameType
  methodArgs: MethodArgsType
  gasPrice?: string | null
  errors?: string[]
  backendParams: BackendParamsType
  setGasPrice?: (gasPrice: string) => void
  successCb: (tx: string, signData: any) => void
  cancelCb: () => void
  errorCb: () => void

  constructor (props: Omit<SignData<MethodNameType, MethodArgsType, BackendParamsType>, 'chainId'>) {
    Object.assign(this, props)
  }

  get chainId (): number {
    return Number(ChainId[this.blockchain])
  }
}
