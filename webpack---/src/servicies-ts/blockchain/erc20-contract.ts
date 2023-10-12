import Currency from '@/models-ts/Currency'
import Web3Contract from '@/models-ts/Web3Contract'
import getWeb3InstanceAsync from '@/servicies-ts/blockchain/web3'
import { Blockchain, BlockchainByChainId, EXPLORER_URL_BY_BLOCKCHAIN, ChainId } from '@/constants-ts/blockchain'
import { getCurrencyInfo } from '@/api/currency'

interface ChainIdKeyContractValue {
  [key: number]: Erc20Contract;
}

let contractsByChainId:ChainIdKeyContractValue = {}

export async function getErc20ContractAsync ({ chainId, address }: { chainId: number, address: string }): Promise<Erc20Contract> {
  const web3 = await getWeb3InstanceAsync({
    chainId
  })
  const artifacts: any = (
    await import(/* webpackChunkName: "erc20-v1.json" */
      '@chronotech/laborx.sc.artifacts/contracts.v1/ERC20.json')
  )
  contractsByChainId[chainId] = new Erc20Contract(
    web3,
    BlockchainByChainId[String(chainId)],
    artifacts.abi,
    address
  )
  return contractsByChainId[chainId]
}

export enum MethodMode {
  ENCODE_ABI = 'encodeABI',
  ESTIMATE_GAS = 'estimateGas',
}

export interface IApproveParams {
  mode: MethodMode,
  from: string,
  spender: string,
  amount: string,
}

export interface ITransferParams {
  mode: MethodMode,
  from: string,
  recipient: string,
  amount: string,
}

export default class Erc20Contract extends Web3Contract {
  methods: { [k: string]: any }
  public approve (
    {
      mode = MethodMode.ENCODE_ABI,
      from,
      spender,
      amount
    }: IApproveParams
  ): string | Promise<number> {
    return mode === MethodMode.ENCODE_ABI
      ? this.contractInstance.methods.approve(spender, amount).encodeABI()
      : this.contractInstance.methods.approve(spender, amount).estimateGas({ from })
  }

  public transfer (
    {
      mode = MethodMode.ENCODE_ABI,
      from,
      recipient,
      amount
    }: ITransferParams
  ): string | Promise<number> {
    return mode === MethodMode.ENCODE_ABI
      ? this.contractInstance.methods.transfer(recipient, amount).encodeABI()
      : this.contractInstance.methods.transfer(recipient, amount).estimateGas({ from })
  }

  public async allowance (owner: string, spender: string): Promise<string> {
    const value = await this.contractInstance.methods.allowance(owner, spender).call()
    return value
  }

  public async balanceOf (account: string): Promise<string> {
    const value = await this.contractInstance.methods.balanceOf(account).call()
    return value
  }

  public contractLink (blockchain: Blockchain):string {
    const explorerUrl = EXPLORER_URL_BY_BLOCKCHAIN[blockchain]
    return `${explorerUrl}/address/${this.contractInstance.options.address}`
  }

  public async toCurrency () {
    const currency: Partial<Currency> = {}
    const getName = this.contractInstance.methods.name().call()
      .then((name: string) => { currency.displayName = (name || '').replace(/ Token$/g, '') })
    const getSymbol = this.contractInstance.methods.symbol().call()
      .then((symb: string) => { currency.name = currency.backendName = symb })
    const getDecimals = this.contractInstance.methods.decimals().call()
      .then((decimals: number) => { currency.decimals = decimals })
    await Promise.all([getName, getSymbol, getDecimals])
    try {
      const info = await getCurrencyInfo(this.contractInstance.options.address)
      currency.image = info.logo
    } catch (e) {
      console.error('Error fething token image', this.contractInstance.options.address, e)
    }
    return new Currency({
      blockchain: this.blockchain,
      network: Number(ChainId[this.blockchain]),
      inputDecimals: 5,
      maxDecimals: 7,
      address: this.contractInstance.options.address,
      ...currency
    })
  }
}
