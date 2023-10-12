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
import { Blockchain, EVM_BLOCKCHAIN, getChainIdByBlockchain, getZeroAddressByWalletGroup, WalletGroup } from '@/constants-ts/blockchain'
import { convertFromUsd, getPreferredCurrency } from '@/utils-ts/currencies'
import {
  getAmountWithCustomerFeeV2 as getAmountWithCustomerFeeV2Tron,
  getBalanceErrors as getBalanceErrorsTron
} from '@/utils-ts/tron/contract'
import { getAmountWithCustomerFeeV2, getBalanceErrors } from '@/utils-ts/contract'
import { getPaymentDetailsCreateContractV2 } from '@/servicies-ts/pay-details/pay-details-lx-v2'
import { getApprove } from '@/servicies-ts/pay-details/pay-details-erc20'
import { getApprove as getApproveTron } from '@/servicies-ts/blockchain/tron/pay-details-erc20'
import SignData, { IBackendParamsCreateContract, TypeSignData } from './SignData'
import { addSeconds, formatDate } from '@/utils/date'
import { DATE_TIME_FORMAT_BY_MERIDIEM } from '@/constants/date'
import PaymentDetail from './PaymentDetail'
import { ContractVersion } from '@/constants-ts/contracts'
import { WNATIVE_BY_BLOCKCHAIN } from '@/constants-ts/currency'
import { getLaborXContractTronAsync, LaborXContractTronV2 } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'
import { getFreelancerWalletForContract } from '@/utils-ts/wallet'

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

type PropsType = Required<CreateContractSignDataV2> & ConstructorParameters<typeof SignData>
type GetInstancePropsType = {
  version: ContractVersion
  scId: string,
  preferredCurrencies: Currency[],
  freelancerWallets: Wallet[]
  freelancerWallet?: Wallet
  deadline: number,
  wallet: Wallet,
  rates: Rate[],
  amountUsd: BigNumber,
  freelancer: FreelancerSignData,
  gigOfferId?: string,
  jobId?: number,
  name: string
  detailsRoute: CreateContractSignDataV2['detailsRoute'],
  successCb: () => void
  errorCb: () => void,
  cancelCb: () => void,
}

export default class CreateContractSignDataV2
  extends SignData<'createContract', ICreateContractParamsV2, IBackendParamsCreateContract>
  implements CurrencySettable {
  type = TypeSignData.CreateContract
  detailsRoute: { name: string, params: {} }
  freelancerWallets: Wallet[]
  freelancerWallet: Wallet | undefined
  amountUsd: BigNumber
  missingBalance?: MissingBalanceToSign[]
  preferredCurrencies: Currency[]
  approve?: IApprove // ToDo: move to CreateContractSignData

  static async createInstance (
    {
      version,
      preferredCurrencies,
      deadline,
      wallet,
      rates,
      gigOfferId,
      jobId,
      freelancerWallets,
      freelancerWallet,
      ...props
    }: GetInstancePropsType
  ): Promise<CreateContractSignDataV2> {
    const TWO_DAYS = 172800
    const date = formatDate(addSeconds(Date.now(), deadline + TWO_DAYS), DATE_TIME_FORMAT_BY_MERIDIEM)
    const currency = getPreferredCurrency(preferredCurrencies, wallet.group)!
    const amount = convertFromUsd({
      value: props.amountUsd,
      currency: currency,
      rates
    }).multipliedBy(currency.baseUnits)
    const contract: any = wallet.group === WalletGroup.TronLink
      ? await getLaborXContractTronAsync()
      : await getLaborXContractV2Async({ chainId: getChainIdByBlockchain(currency.blockchain) })
    const amountAndFee: BigNumber = wallet.group === WalletGroup.TronLink
      ? await getAmountWithCustomerFeeV2Tron(amount, contract)
      : await getAmountWithCustomerFeeV2(amount, contract)
    let payableAmount: string = currency.isBaseCurrency ? amountAndFee.toFixed(0) : '0'
    const deadlineBN: BigNumber = new BigNumber(deadline || 0)
    const postfix: 'Eth' | 'Erc20' = currency.isBaseCurrency ? 'Eth' : 'Erc20'
    const freelancerAddress = freelancerWallet?.address || getFreelancerWalletForContract(freelancerWallets, wallet.group)?.address!
    const methodArgs: ICreateContractParamsV2 = {
      mode: 'encodeABI',
      from: wallet.address,
      contractId: props.scId,
      freelancer: freelancerAddress,
      disputer: getZeroAddressByWalletGroup(wallet.group),
      token: (currency.isBaseCurrency ? WNATIVE_BY_BLOCKCHAIN[currency.blockchain] : currency.address)!,
      amount: amount.toFixed(0),
      duration: deadlineBN.toFixed(0),
      percentToBaseConvert: '0',
    }
    let gasPrice: string | null = null
    let paymentDetails: PaymentDetail[] = await getPaymentDetailsCreateContractV2(
      methodArgs,
      contract,
      wallet,
      currency,
      payableAmount,
      gasPrice
    )
    if (wallet.group !== WalletGroup.TronLink) {
      gasPrice = await contract.web3Instance.eth.getGasPrice()
    }
    const { errors, missingBalance } = wallet.group === WalletGroup.TronLink
      ? await getBalanceErrorsTron(currency, wallet, paymentDetails, amountAndFee)
      : await getBalanceErrors(currency, wallet, paymentDetails, amountAndFee)
    const approve = wallet.group === WalletGroup.TronLink
      ? await getApproveTron(
        currency,
        wallet,
        contract.contractInstance.address,
        amountAndFee.toFixed(0) || '0'
      )
      : await getApprove(
        currency,
        getChainIdByBlockchain(currency.blockchain),
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
      freelancerWallet: freelancerAddress,
      backendCurrencyId: currency.backendId,
      deadline: deadlineBN.toNumber(),
    }
    return new CreateContractSignDataV2({
      ...props,
      freelancerWallet,
      freelancerWallets: freelancerWallets || [],
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
    super(props as SignData<'createContract', ICreateContractParamsV2, IBackendParamsCreateContract>)
    this.detailsRoute = detailsRoute
    this.amountUsd = amountUsd
    this.missingBalance = missingBalance
    this.preferredCurrencies = preferredCurrencies
    this.methodName = 'createContract'
    this.approve = approve
    this.setGasPrice = async function (gasPrice: string) {
      this.gasPrice = gasPrice
      const chainId = getChainIdByBlockchain(this.currency?.blockchain)
      let contract: any = this.wallet.group === WalletGroup.TronLink
        ? await getLaborXContractTronAsync()
        : await getLaborXContractV2Async({ chainId })
      this.paymentDetails = await getPaymentDetailsCreateContractV2(
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
      } = this.wallet.group === WalletGroup.TronLink
        ? await getBalanceErrorsTron(this.currency, this.wallet, this.paymentDetails, this.amountAndFee!)
        : await getBalanceErrors(this.currency, this.wallet, this.paymentDetails, this.amountAndFee!)
      this.errors = errors
      this.missingBalance = missingBalance
    }
  }

  async setCurrency (currency: Currency, rates: Rate[]) {
    this.currency = currency
    let contract: LaborXContractV2 | LaborXContractTronV2 = currency.blockchain === Blockchain.Tron
      ? await getLaborXContractTronAsync()
      : await getLaborXContractV2Async({ chainId: getChainIdByBlockchain(currency.blockchain) })
    const amount: BigNumber = convertFromUsd({
      value: this.amountUsd,
      currency,
      rates
    }).multipliedBy(currency.baseUnits)
    this.methodArgs.amount = amount.toFixed(0)
    this.methodArgs.token = (currency.isBaseCurrency ? WNATIVE_BY_BLOCKCHAIN[currency.blockchain] : currency.address)!
    if (currency.blockchain !== this.blockchain) {
      if (currency.blockchain === Blockchain.Tron) {
        this.gasPrice = undefined
      } else {
        const contractEvm = contract as LaborXContractV2
        this.gasPrice = await contractEvm.web3Instance.eth.getGasPrice()
      }
      this.blockchain = currency.blockchain
    }
    this.backendParams.backendCurrencyId = currency.backendId
    this.backendParams.blockchain = currency.blockchain
    this.contractLink = contract.contractLink(currency.blockchain)
    await this.initContractData(contract, rates)
  }

  async setWallet (wallet: Wallet, rates: Rate[]) {
    let contract: any
    if (wallet.group === WalletGroup.TronLink) {
      contract = await getLaborXContractTronAsync()
      const freelancerAddress = getFreelancerWalletForContract(this.freelancerWallets, WalletGroup.TronLink)?.address!
      this.currency = this.preferredCurrencies.find((currency: Currency) => currency.blockchain === Blockchain.Tron) as Currency
      this.methodArgs.token = this.currency.contractTokenAddress
      this.blockchain = Blockchain.Tron
      this.backendParams.backendCurrencyId = this.currency.backendId
      this.backendParams.blockchain = Blockchain.Tron
      this.methodArgs.disputer = getZeroAddressByWalletGroup(wallet.group)
      this.methodArgs.freelancer = freelancerAddress
      this.backendParams.freelancerWallet = freelancerAddress
    } else {
      const freelancerAddress = getFreelancerWalletForContract(this.freelancerWallets, WalletGroup.Cloud)?.address!
      this.currency = this.preferredCurrencies
        .find((currency: Currency) => {
          return EVM_BLOCKCHAIN.includes(currency.blockchain)
        }) as Currency
      contract = await getLaborXContractV2Async({ chainId: getChainIdByBlockchain(this.currency.blockchain) })
      this.gasPrice = await contract.web3Instance.eth.getGasPrice()
      this.methodArgs.token = this.currency.contractTokenAddress
      this.methodArgs.disputer = getZeroAddressByWalletGroup(wallet.group)
      this.backendParams.blockchain = this.currency.blockchain
      this.methodArgs.freelancer = freelancerAddress
      this.backendParams.freelancerWallet = freelancerAddress
      this.blockchain = this.currency.blockchain
    }
    this.wallet = wallet
    this.methodArgs.from = wallet.address
    this.backendParams.customerWallet = wallet.address
    await this.initContractData(contract, rates)
  }

  async initContractData (contract: LaborXContractV2 | LaborXContractTronV2, rates: Rate[]) {
    const currency = this.currency
    const wallet = this.wallet
    const amount = convertFromUsd({
      value: this.amountUsd,
      currency: currency,
      rates,
    }).multipliedBy(currency.baseUnits)
    this.methodArgs.amount = amount.toFixed(0)
    this.amountAndFee = wallet.group === WalletGroup.TronLink
      ? await getAmountWithCustomerFeeV2Tron(amount, contract as LaborXContractTronV2)
      : await getAmountWithCustomerFeeV2(amount, contract)
    this.payableAmount = this.currency.isBaseCurrency ? this.amountAndFee.toFixed(0) : '0'
    this.approve = wallet.group === WalletGroup.TronLink
      ? await getApproveTron(
        currency,
        wallet,
        contract.contractInstance.address,
        this.amountAndFee.toFixed(0) || '0'
      )
      : await getApprove(
        currency,
        getChainIdByBlockchain(currency.blockchain),
        this.wallet,
        this.gasPrice || '0',
        contract.contractInstance.options.address,
        this.amountAndFee.toFixed(0)
      )
    this.paymentDetails = await getPaymentDetailsCreateContractV2(
      this.methodArgs,
      contract,
      this.wallet,
      currency,
      this.payableAmount,
      this.gasPrice || '0'
    )
    const { errors, missingBalance } = wallet.group === WalletGroup.TronLink
      ? await getBalanceErrorsTron(currency, wallet, this.paymentDetails, this.amountAndFee)
      : await getBalanceErrors(currency, wallet, this.paymentDetails, this.amountAndFee)
    this.errors = errors
    this.missingBalance = missingBalance
  }
}
