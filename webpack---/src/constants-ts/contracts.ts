
type GasLimitByMethodType = {
  [key: string]: number
}

export enum ContractType {
  ReadWithTronWeb = 1,
  WriteWithTronLink = 2
}

export const GasLimitByMethodV1: GasLimitByMethodType = {
  createContract: 200000,
  payToFreelancer: 170000,
  returnFundsToCustomer: 170000,
  approve: 150000,
  transfer: 150000,
}

export const GasLimitByMethodV2: GasLimitByMethodType = {
  createContract: 300000,
  payToFreelancer: 250000,
  refundToCustomerByFreelancer: 250000,
  refundToCustomerByCustomer: 250000,
  refundToCustomerWithFreelancerSignature: 250000,
  approve: 150000,
  transfer: 150000,
}

export enum LxMethodPostfix {
  Eth = 'Eth',
  Erc20 = 'Erc20',
}

export declare type UserFeesV1 = {
  customerFee: string;
  freelancerFee: string;
}

export declare type UserFeesV2 = {
  _customerFee: string;
  _freelancerFee: string;
}

export enum ContractVersion {
  v1 = 1,
  v2 = 2,
}

export const getSuccessEventNameByMethodName = (methodName: string) => {
  switch (methodName) {
    case 'createContract': return 'ContractCreated'
    case 'payToFreelancer': return 'PayedToFreelancer'
    case 'refundToCustomerByFreelancer': return 'RefundedToCustomer'
    case 'refundToCustomerByCustomer': return 'RefundedToCustomer'
  }
}
