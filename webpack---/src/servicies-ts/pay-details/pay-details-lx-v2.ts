import BigNumber from 'bignumber.js'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'
import Wallet from '@/models-ts/Wallet'
import { SERVICE_FEE_PRECISION_V2 } from '@/constants/blockchain/contract'
import Currency from '@/models-ts/Currency'
import { GasLimitByMethodV2 } from '@/constants-ts/contracts'
import LaborXContractV2, {
  ICreateContractParamsV2,
  IPayToFreelancerParamsV2,
  IRefundToCustomerByCustomerParamsV2,
  IRefundToCustomerByFreelancerParamsV2
} from '@/servicies-ts/blockchain/laborx-contract-v2'
import { LaborXContractTronV2 } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'
import { extractRevert } from '@/utils-ts/transaction'
import { Blockchain, WalletGroup } from '@/constants-ts/blockchain'

export const getPaymentDetailsCreateContractV2 = async (
  methodArgs: ICreateContractParamsV2,
  contract: LaborXContractV2 | LaborXContractTronV2,
  wallet: Wallet,
  currency: Currency,
  payableAmount: string,
  gasPrice: string | null,
): Promise<PaymentDetail[]> => {
  let paymentDetails: PaymentDetail[] = []
  const { _customerFee } = await contract.getServiceFees()
  const customerFeeAmount: BigNumber = new BigNumber(methodArgs.amount)
    .dividedBy(100)
    .multipliedBy(_customerFee.toString())
    .dividedBy(SERVICE_FEE_PRECISION_V2)

  paymentDetails.push(new PaymentDetail({
    type: PaymentDetailsTypes.DepositAmount,
    name: 'Deposit amount',
    currency,
    amount: new BigNumber(methodArgs.amount),
  }))
  paymentDetails.push(new PaymentDetail({
    type: PaymentDetailsTypes.CustomerFee,
    name: 'Customer service fee',
    currency,
    amount: customerFeeAmount,
  }))
  if (wallet.group !== WalletGroup.TronLink) {
    let gasLimit: number = GasLimitByMethodV2['createContract']
    try {
      // @ts-ignore
      gasLimit = await contract.createContract({
        ...methodArgs,
        mode: 'estimateGas',
        value: payableAmount,
      })
    } catch (err) {
      console.log('err', extractRevert(err))
    }
    paymentDetails.push(new PaymentDetail({
      type: PaymentDetailsTypes.Fee,
      name: 'Estimated record fee',
      currency: currency.baseCurrency,
      gasLimit: new BigNumber(gasLimit),
      gasPrice: new BigNumber(gasPrice || 1),
    }))
  }
  return paymentDetails
}

export const getPaymentDetailsPayToFreelancerV2 = async (
  methodArgs: IPayToFreelancerParamsV2,
  contract: LaborXContractV2,
  currency: Currency,
  gasPrice: string,
): Promise<PaymentDetail[]> => {
  const paymentDetails: PaymentDetail[] = []
  if (currency.blockchain !== Blockchain.Tron) {
    let gasLimit: number = GasLimitByMethodV2['payToFreelancer']
    try {
      // @ts-ignore
      gasLimit = await contract.payToFreelancer({
        ...methodArgs,
        mode: 'estimateGas',
      })
    } catch (err) {
      console.log('err', extractRevert(err))
    }
    paymentDetails.push(new PaymentDetail({
      type: PaymentDetailsTypes.Fee,
      name: 'Estimated network fee',
      currency: currency.baseCurrency,
      gasLimit: new BigNumber(gasLimit),
      gasPrice: new BigNumber(gasPrice),
    }))
  }
  return paymentDetails
}

export const getPaymentDetailsRefundToCustomerByFreelancerV2 = async (
  methodArgs: IRefundToCustomerByFreelancerParamsV2,
  contract: LaborXContractV2,
  currency: Currency,
  gasPrice: string,
): Promise<PaymentDetail[]> => {
  const paymentDetails: PaymentDetail[] = []
  if (currency.blockchain !== Blockchain.Tron) {
    let gasLimit: number = GasLimitByMethodV2['refundToCustomerByFreelancer']
    try {
      // @ts-ignore
      gasLimit = await contract.refundToCustomerByFreelancer({
        ...methodArgs,
        mode: 'estimateGas',
      })
    } catch (err) {
      console.log('err', extractRevert(err))
    }
    paymentDetails.push(new PaymentDetail({
      type: PaymentDetailsTypes.Fee,
      name: 'Estimated network fee',
      currency: currency.baseCurrency,
      gasLimit: new BigNumber(gasLimit),
      gasPrice: new BigNumber(gasPrice),
    }))
  }
  return paymentDetails
}

export const getPaymentDetailsRefundToCustomerByCustomerV2 = async (
  methodArgs: IRefundToCustomerByCustomerParamsV2,
  contract: LaborXContractV2,
  currency: Currency,
  gasPrice: string,
): Promise<PaymentDetail[]> => {
  const paymentDetails: PaymentDetail[] = []
  if (currency.blockchain !== Blockchain.Tron) {
    let gasLimit: number = GasLimitByMethodV2['refundToCustomerByCustomer']
    try {
      // @ts-ignore
      gasLimit = await contract.refundToCustomerByCustomer({
        ...methodArgs,
        mode: 'estimateGas',
      })
    } catch (err) {
      console.log('err', extractRevert(err))
    }
    paymentDetails.push(new PaymentDetail({
      type: PaymentDetailsTypes.Fee,
      name: 'Estimated network fee',
      currency: currency.baseCurrency,
      gasLimit: new BigNumber(gasLimit),
      gasPrice: new BigNumber(gasPrice),
    }))
  }
  return paymentDetails
}
