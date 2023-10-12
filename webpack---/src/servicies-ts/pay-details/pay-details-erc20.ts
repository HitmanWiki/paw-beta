import Currency from '@/models-ts/Currency'
import Wallet from '@/models-ts/Wallet'
import { IApprove } from '@/models-ts/sign-process/CreateContractSignDataV2'
import Erc20Contract, { getErc20ContractAsync, MethodMode } from '@/servicies-ts/blockchain/erc20-contract'
import BigNumber from 'bignumber.js'
import { MAX_AMOUNT_APPROVE } from '@/constants/blockchain/erc20'
import PaymentDetail, { PaymentDetailsTypes } from '@/models-ts/sign-process/PaymentDetail'

export const getApprove = async (
  currency: Currency | undefined,
  chainId: number,
  wallet: Wallet | undefined,
  gasPrice: string,
  spender: string,
  amount: string
): Promise<IApprove | undefined> => {
  if (!currency?.isBaseCurrency) {
    const erc20Contract: Erc20Contract = await getErc20ContractAsync({
      chainId,
      address: currency?.address || ''
    })
    const allowance: string = await erc20Contract.allowance(
      wallet?.address || '',
      spender
    )
    if (new BigNumber(allowance).isLessThan(amount)) {
      // @ts-ignore
      const gasLimit: number = await erc20Contract.approve({
        from: wallet?.address || '',
        spender,
        amount: MAX_AMOUNT_APPROVE,
        mode: MethodMode.ESTIMATE_GAS
      })
      // TODO добавить проверки недостатка баланса для выполнения транзакции gasLimit и исключение
      const details: PaymentDetail[] = [new PaymentDetail({
        type: PaymentDetailsTypes.Fee,
        name: 'Estimated record fee',
        currency: currency?.baseCurrency,
        gasLimit: new BigNumber(gasLimit),
        gasPrice: new BigNumber(gasPrice),
      })]
      return {
        spender,
        amount,
        details
      }
    }
  }
}
