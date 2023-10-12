import BigNumber from 'bignumber.js'
import Wallet from '@/models-ts/Wallet'
import { SERVICE_FEE_PRECISION_V2 } from '@/constants/blockchain/contract'
import Currency from '@/models-ts/Currency'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'
import { MissingBalanceToSign } from '@/models-ts/sign-process/CreateContractSignDataV2'
import { LaborXContractTronV2 } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'
import { getErc20ContractTronAsync } from '@/servicies-ts/blockchain/tron/erc20-contract'

export const getAmountWithCustomerFeeV2 = async (amount: BigNumber, contract: LaborXContractTronV2)
  : Promise<BigNumber> => {
  const { _customerFee } = await contract.getServiceFees()
  if (new BigNumber(_customerFee.toString()).isEqualTo(0)) {
    return amount
  }
  const customerAmountFee = amount
    .dividedBy(100)
    .multipliedBy(_customerFee.toString())
    .dividedBy(SERVICE_FEE_PRECISION_V2)
  return amount.plus(customerAmountFee)
}

export const getBalanceErrors = async (
  currency: Currency,
  wallet: Wallet,
  paymentDetails: PaymentDetail[],
  amountAndFee: BigNumber
): Promise<{ errors: string[], missingBalance: MissingBalanceToSign[] }> => {
  const errors: string[] = []
  const missingBalance: MissingBalanceToSign[] = []
  if (!currency.isBaseCurrency) {
    const erc20Contract = await getErc20ContractTronAsync({ address: currency.address })
    const balanceErc20: string = await erc20Contract.balanceOf(wallet?.address)
    if (amountAndFee.isGreaterThan(balanceErc20 || 0)) {
      errors.push(`Not enough ${currency.name} balance to complete the transaction`)
      missingBalance.push({ value: amountAndFee.minus(balanceErc20), currency })
    }
  }
  return { errors, missingBalance }
}
