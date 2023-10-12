import BigNumber from 'bignumber.js'
import Currency from '@/models-ts/Currency'
import LaborXContractV2, {
  getLaborXContractV2Async,
  ICreateContractParamsV2,
} from '@/servicies-ts/blockchain/laborx-contract-v2'
import Rate from '@/models-ts/Rate'
import Wallet from '@/models-ts/Wallet'
import { Avatar } from '@/models/user'
import { AccountTypes } from '@/constants-ts/user/accountTypes'
import { Blockchain, ChainId } from '@/constants-ts/blockchain'
import { convertFromUsd, getPreferredCurrency } from '@/utils-ts/currencies'
import { getAmountWithCustomerFeeV1, getAmountWithCustomerFeeV2, getBalanceErrors } from '@/utils-ts/contract'
import { getPaymentDetailsCreateContractV2 } from '@/servicies-ts/pay-details/pay-details-lx-v2'
import { getApprove } from '@/servicies-ts/pay-details/pay-details-erc20'
import SignData, { IBackendParamsCreateContract, TypeSignData } from './SignData'
import { addSeconds, formatDate } from '@/utils/date'
import { DATE_TIME_FORMAT_BY_MERIDIEM } from '@/constants/date'
import PaymentDetail from './PaymentDetail'
import { ContractVersion } from '@/constants-ts/contracts'
import { getPaymentDetailsCreateContractV1 } from '@/servicies-ts/pay-details/pay-details-lx-v1'
import LaborXContractV1, { getLaborXContractV1Async, ICreateContractParamsV1 } from '@/servicies-ts/blockchain/laborx-contract-v1'

export type IApprove = {
  spender: string,
  amount: string,
  details?: PaymentDetail[],
}

export type FreelancerSignData = {
  id: string | number
  name: string
  avatar: Avatar
  type: AccountTypes
  wallet: string
}

export type MissingBalanceToSign = {
  value: BigNumber,
  currency: Currency,
}

export interface CurrencySettable {
  setCurrency: (currency: Currency, rates: Rate[]) => Promise<void>
  setWallet: (wallet: Wallet, rates: Rate[]) => Promise<void>
}

type PropsType = Required<CreateContractSignDataV1> & ConstructorParameters<typeof SignData>
type GetInstancePropsType = {
  version: ContractVersion
  scId: string,
  preferredCurrencies: Currency[],
  deadline: number,
  wallet: Wallet,
  rates: Rate[],
  amountUsd: BigNumber,
  freelancer: FreelancerSignData,
  gigOfferId?: string,
  jobId?: number,
  name: string
  detailsRoute: CreateContractSignDataV1['detailsRoute'],
  successCb: () => void
  errorCb: () => void
}

export default class CreateContractSignDataV1
  extends SignData<'createContract', ICreateContractParamsV1, IBackendParamsCreateContract>
  implements CurrencySettable {
  type = TypeSignData.CreateContract
  detailsRoute: { name: string, params: {} }
  amountUsd: BigNumber
  missingBalance?: MissingBalanceToSign[]
  preferredCurrencies: Currency[]
  approve?: IApprove // ToDo: move to CreateContractSignData

  static async createInstance (
    { version, preferredCurrencies, deadline, wallet, rates, gigOfferId, jobId, ...props }: GetInstancePropsType
  ): Promise<CreateContractSignDataV1> {
    const TWO_DAYS = 172800
    const date = formatDate(addSeconds(Date.now(), deadline + TWO_DAYS), DATE_TIME_FORMAT_BY_MERIDIEM)
    const currency = getPreferredCurrency(preferredCurrencies)!
    const chainId = Number(ChainId[currency.blockchain])
    const amount = convertFromUsd({
      value: props.amountUsd,
      currency: currency,
      rates
    }).multipliedBy(currency.baseUnits)
    const contract: any = await getLaborXContractV1Async({ chainId })
    const amountAndFee: BigNumber = await getAmountWithCustomerFeeV1(amount, wallet, contract)
    let payableAmount: string = currency.isBaseCurrency ? amountAndFee.toFixed(0) : '0'
    const deadlineBN: BigNumber = new BigNumber(deadline || 0)
    const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
    const methodArgs: ICreateContractParamsV1 = {
      postfix,
      mode: 'encodeABI',
      from: wallet.address,
      contractId: props.scId,
      currencyAddress: currency.address,
      customerAddress: wallet.address,
      freelancerAddress: props.freelancer.wallet,
      disputerAddress: '0x0000000000000000000000000000000000000000',
      amount: amount.toFixed(0),
      hoursInSeconds: deadlineBN.toFixed(0),
    }
    const gasPrice: string = await contract.web3Instance.eth.getGasPrice()
    const paymentDetails: PaymentDetail[] = await getPaymentDetailsCreateContractV1(
      methodArgs,
      contract,
      wallet,
      currency,
      payableAmount,
      gasPrice
    )
    const { errors, missingBalance } = await getBalanceErrors(currency, wallet, paymentDetails, amountAndFee)
    const approve = await getApprove(
      currency,
      chainId,
      wallet,
      gasPrice || '0',
      contract.contractInstance.options.address,
      amountAndFee.toFixed(0) || '0'
    )
    const backendParams: IBackendParamsCreateContract = {
      postfix,
      jobId,
      gigOfferId,
      scId: props.scId,
      blockchain: currency.blockchain,
      customerWallet: wallet.address || '',
      backendCurrencyId: currency.backendId,
      deadline: deadlineBN.toNumber(),
    }
    return new CreateContractSignDataV1({
      ...props,
      version,
      wallet,
      freelancer: props.freelancer,
      deadline,
      payableAmount,
      amountAndFee,
      // @ts-ignore
      approve,
      currency,
      preferredCurrencies,
      blockchain: currency.blockchain,
      contractName: 'LaborXContractV1',
      paymentDetails,
      contractLink: contract.contractLink(currency.blockchain),
      gasPrice,
      errors,
      missingBalance,
      backendParams,
      methodName: 'createContract',
      methodArgs,
      title: 'Create Contract',
      description: `Create a contract with a freelancer.<br>
Funds will be locked in escrow and can be released after <b>${date}</b>.<br>`,
    })
  }

  constructor (
    {
      detailsRoute,
      amountUsd,
      missingBalance,
      preferredCurrencies,
      approve,
      ...props
    }: PropsType
  ) {
    super(props as SignData<'createContract', ICreateContractParamsV1, IBackendParamsCreateContract>)
    this.detailsRoute = detailsRoute
    this.amountUsd = amountUsd
    this.missingBalance = missingBalance
    this.preferredCurrencies = preferredCurrencies
    this.methodName = 'createContract'
    this.approve = approve
    this.setGasPrice = async function (gasPrice: string) {
      this.gasPrice = gasPrice
      const chainId = Number(ChainId[this.currency?.blockchain || Blockchain.Ethereum])
      let contract: any = await getLaborXContractV1Async({ chainId })
      this.paymentDetails = await getPaymentDetailsCreateContractV1(
        this.methodArgs,
        contract,
        this.wallet,
        this.currency,
        this.payableAmount,
        this.gasPrice
      )
      const {
        errors,
        missingBalance
      } = await getBalanceErrors(this.currency, this.wallet, this.paymentDetails, this.amountAndFee!)
      this.errors = errors
      this.missingBalance = missingBalance
    }
  }

  async setCurrency (currency: Currency, rates: Rate[]) {
    this.currency = currency
    const chainId = Number(ChainId[currency.blockchain])
    let contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
    const amount: BigNumber = convertFromUsd({
      value: this.amountUsd,
      currency,
      rates
    }).multipliedBy(currency.baseUnits)
    const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
    this.methodArgs.postfix = postfix
    this.methodArgs.amount = amount.toFixed(0)
    this.methodArgs.currencyAddress = currency.address
    if (currency.blockchain !== this.blockchain) {
      this.gasPrice = await contract.web3Instance.eth.getGasPrice()
      this.blockchain = currency.blockchain
    }
    this.backendParams.postfix = postfix
    this.backendParams.backendCurrencyId = currency.backendId
    this.backendParams.blockchain = currency.blockchain
    this.contractLink = contract.contractLink(currency.blockchain)
    await this.initContractData(contract, rates)
  }

  async setWallet (wallet: Wallet, rates: Rate[]) {
    const currency = this.currency
    const chainId = Number(ChainId[currency.blockchain || Blockchain.Ethereum])
    const contract: LaborXContractV1 = await getLaborXContractV1Async({ chainId })
    this.wallet = wallet
    this.methodArgs.from = wallet.address
    this.backendParams.customerWallet = wallet.address
    await this.initContractData(contract, rates)
  }

  async initContractData (contract: LaborXContractV1, rates: Rate[]) {
    const currency = this.currency
    const wallet = this.wallet
    const chainId = Number(ChainId[currency.blockchain || Blockchain.Ethereum])
    const amount = convertFromUsd({
      value: this.amountUsd,
      currency: currency,
      rates,
    }).multipliedBy(currency.baseUnits)
    this.amountAndFee = await getAmountWithCustomerFeeV1(amount, wallet, contract)
    this.payableAmount = this.currency.isBaseCurrency ? this.amountAndFee.toFixed(0) : '0'
    this.approve = await getApprove(
      currency,
      chainId,
      this.wallet,
      this.gasPrice || '0',
      contract.contractInstance.options.address,
      this.amountAndFee.toFixed(0)
    )
    this.paymentDetails = await getPaymentDetailsCreateContractV1(
      this.methodArgs,
      contract,
      this.wallet,
      currency,
      this.payableAmount,
      this.gasPrice || '0'
    )
    const { errors, missingBalance } = await getBalanceErrors(currency, wallet, this.paymentDetails, this.amountAndFee)
    this.errors = errors
    this.missingBalance = missingBalance
  }
}
