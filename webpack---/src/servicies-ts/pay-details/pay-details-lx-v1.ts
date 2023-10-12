import BigNumber from 'bignumber.js'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'
import LaborXContractV1, {
  ICreateContractParamsV1,
  IPayToFreelancerParamsV1
} from '@/servicies-ts/blockchain/laborx-contract-v1'
import Currency from '@/models-ts/Currency'
import { GasLimitByMethodV1, GasLimitByMethodV2 } from '@/constants-ts/contracts'
import { extractRevert } from '@/utils-ts/transaction'
import Wallet from '@/models-ts/Wallet'
import { SERVICE_FEE_PRECISION_V1 } from '@/constants/blockchain/contract'

export const getPaymentDetailsCreateContractV1 = async (
  methodArgs: ICreateContractParamsV1,
  contract: LaborXContractV1,
  wallet: Wallet,
  currency: Currency,
  payableAmount: string,
  gasPrice: string,
): Promise<PaymentDetail[]> => {
  let paymentDetails: PaymentDetail[] = []
  const { customerFee } = await contract.getServiceFeesForAccount(wallet.address)
  const customerFeeAmount: BigNumber = new BigNumber(methodArgs.amount)
    .dividedBy(100)
    .multipliedBy(customerFee)
    .dividedBy(SERVICE_FEE_PRECISION_V1)

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
    gasPrice: new BigNumber(gasPrice),
  }))
  return paymentDetails
}

export const getPaymentDetailsPayToFreelancerV1 = async (
  methodArgs: IPayToFreelancerParamsV1,
  contract: LaborXContractV1,
  currency: Currency,
  gasPrice: string,
): Promise<PaymentDetail[]> => {
  const paymentDetails: PaymentDetail[] = []
  let gasLimit = GasLimitByMethodV1['payToFreelancer']
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
  return paymentDetails
}

export const getPaymentDetailsReturnFundsToCustomerV1 = async (
  methodArgs: IPayToFreelancerParamsV1,
  contract: LaborXContractV1,
  currency: Currency,
  gasPrice: string,
): Promise<PaymentDetail[]> => {
  const paymentDetails: PaymentDetail[] = []
  let gasLimit: number = GasLimitByMethodV1['returnFundsToCustomer']
  try {
    // @ts-ignore
    gasLimit = await contract.returnFundsToCustomer({
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
  return paymentDetails
}
