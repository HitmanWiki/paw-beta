import BigNumber from 'bignumber.js'
import Wallet from '@/models-ts/Wallet'
import LaborXContractV1 from '@/servicies-ts/blockchain/laborx-contract-v1'
import { SERVICE_FEE_PRECISION_V1, SERVICE_FEE_PRECISION_V2 } from '@/constants/blockchain/contract'
import Currency from '@/models-ts/Currency'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'
import { getErc20ContractAsync } from '@/servicies-ts/blockchain/erc20-contract'
import getWeb3InstanceAsync from '@/servicies-ts/blockchain/web3'
import { getChainIdByBlockchain } from '@/constants-ts/blockchain'
import { MissingBalanceToSign } from '@/models-ts/sign-process/CreateContractSignDataV2'
import LaborXContractV2 from '@/servicies-ts/blockchain/laborx-contract-v2'
import { LaborXContractTronV2 } from '@/servicies-ts/blockchain/tron/laborx-contract-v2'

export const getAmountWithCustomerFeeV1 = async (amount: BigNumber, wallet: Wallet, contract: LaborXContractV1)
  : Promise<BigNumber> => {
  const { customerFee } = await contract.getServiceFeesForAccount(wallet.address)
  if (new BigNumber(customerFee).isEqualTo(0)) {
    return amount
  }
  const customerAmountFee = amount
    .dividedBy(100)
    .multipliedBy(customerFee)
    .dividedBy(SERVICE_FEE_PRECISION_V1)
  return amount.plus(customerAmountFee)
}

export const getAmountWithCustomerFeeV2 = async (amount: BigNumber, contract: LaborXContractV2 | LaborXContractTronV2)
  : Promise<BigNumber> => {
  const { _customerFee } = await contract.getServiceFees()
  if (new BigNumber(_customerFee).isEqualTo(0)) {
    return amount
  }
  const customerAmountFee = amount
    .dividedBy(100)
    .multipliedBy(_customerFee)
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
  const chainId = getChainIdByBlockchain(currency.blockchain)
  const web3 = await getWeb3InstanceAsync({ chainId })
  const balanceBase: string = await web3.eth.getBalance(wallet?.address)
  const detailFee: PaymentDetail | undefined = paymentDetails.find((item: PaymentDetail) => item.type === PaymentDetailsTypes.Fee)
  if (currency.isBaseCurrency) {
    const balanceRequire: BigNumber = amountAndFee.plus(detailFee?.amountTotal || 0)
    if (balanceBase && balanceRequire.isGreaterThan(balanceBase || 0)) {
      errors.push(`Not enough ${currency.name} balance to complete the transaction`)
      missingBalance.push({ value: balanceRequire.minus(balanceBase), currency })
    }
  } else {
    const balanceRequire: BigNumber = new BigNumber(detailFee?.amountTotal || 0)
    if (balanceBase && balanceRequire.isGreaterThan(balanceBase || 0)) {
      errors.push(`Not enough ${currency.baseCurrency.name} balance to complete the transaction`)
      missingBalance.push({ value: balanceRequire.minus(balanceBase), currency: currency.baseCurrency })
    }
    const erc20Contract = await getErc20ContractAsync({ chainId, address: currency.address })
    const balanceErc20: string = await erc20Contract.balanceOf(wallet?.address)
    if (amountAndFee.isGreaterThan(balanceErc20 || 0)) {
      errors.push(`Not enough ${currency.name} balance to complete the transaction`)
      missingBalance.push({ value: amountAndFee.minus(balanceErc20), currency })
    }
  }
  return { errors, missingBalance }
}
