import { getTronWebInstanceAsync } from '@/servicies-ts/blockchain/tron/tronweb'
import Currency from '@/models-ts/Currency'
import { getErc20ContractTronAsync } from '@/servicies-ts/blockchain/tron/erc20-contract'

export async function getBalances ({ address, tokens }: { address: string, tokens: Currency[] }) {
  const balances:any = {}
  if (address && address !== '') {
    for (let token of tokens) {
      balances[token.name] = '0'
      const isTRX = token.name === 'TRX'
      if (isTRX) {
        const tronWeb = await getTronWebInstanceAsync()
        balances[token.name] = String(await tronWeb.trx.getBalance(address))
      } else {
        const erc20Contract = await getErc20ContractTronAsync({ address: token.address })
        balances[token.name] = await erc20Contract.balanceOf(address)
      }
    }
  }
  return balances
}
