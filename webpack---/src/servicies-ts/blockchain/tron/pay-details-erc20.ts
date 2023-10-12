import Currency from '@/models-ts/Currency'
import Wallet from '@/models-ts/Wallet'
import { IApprove } from '@/models-ts/sign-process/CreateContractSignDataV2'
import { getErc20ContractTronAsync, Erc20ContractTron } from '@/servicies-ts/blockchain/tron/erc20-contract'
import BigNumber from 'bignumber.js'

export const getApprove = async (
  currency: Currency | undefined,
  wallet: Wallet | undefined,
  spender: string,
  amount: string
): Promise<IApprove | undefined> => {
  if (!currency?.isBaseCurrency) {
    const erc20Contract: Erc20ContractTron = await getErc20ContractTronAsync({
      address: currency?.address || ''
    })
    const allowance: string = await erc20Contract.allowance(
      wallet?.address || '',
      spender
    )
    if (new BigNumber(allowance).isLessThan(amount)) {
      return {
        spender,
        amount,
        details: [],
      }
    }
  }
}
