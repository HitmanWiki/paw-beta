export const EVENT_CONTRACT_CREATED = 'ContractCreated'
export const EVENT_CONTRACT_BLOCKED = 'ContractBlocked'
export const EVENT_PAY_TO_FREELANCER = 'PayToFreelancer'
export const EVENT_RETURN_FUNDS_TO_CUSTOMER = 'ReturnFundsToCustomer'
export const EVENT_DISTRIBUTION_FUNDS_FOR_PARTIALS = 'DistributionFundsForPartials'

export const EVENT_NAMES = {
    [EVENT_CONTRACT_CREATED]: 'Contract Created',
    [EVENT_CONTRACT_BLOCKED]: 'Contract Blocked',
    [EVENT_PAY_TO_FREELANCER]: 'Freelancer Payment',
    [EVENT_RETURN_FUNDS_TO_CUSTOMER]: 'Refunds to the Customer',
    [EVENT_DISTRIBUTION_FUNDS_FOR_PARTIALS]: 'Dispute Resolved'
}

export const EVENT_APPROVAL = 'Approval'

export const METHOD_UNKNOWN = 'unknown'

export const METHOD_CREATE_CONTRACT_ETH = 'createContractEth'
export const METHOD_CREATE_CONTRACT_ERC20 = 'createContractErc20'
export const METHOD_PAY_TO_FREELANCER_ETH = 'payToFreelancerEth'
export const METHOD_PAY_TO_FREELANCER_ERC20 = 'payToFreelancerErc20'
export const METHOD_RETURN_FUNDS_TO_CUSTOMER_ETH = 'returnFundsToCustomerEth'
export const METHOD_RETURN_FUNDS_TO_CUSTOMER_ERC20 = 'returnFundsToCustomerErc20'
export const METHOD_BLOCK_CONTRACT = 'blockContract'
export const METHOD_DISTRIBUTION_FUNDS_FOR_PARTIALS = 'distributionFundsForPartials'

export const METHOD_APPROVE = 'approve'

export const METHOD_SUCCESS_EVENT = {
    [METHOD_CREATE_CONTRACT_ETH]: EVENT_CONTRACT_CREATED,
    [METHOD_CREATE_CONTRACT_ERC20]: EVENT_CONTRACT_CREATED,
    [METHOD_PAY_TO_FREELANCER_ETH]: EVENT_PAY_TO_FREELANCER,
    [METHOD_PAY_TO_FREELANCER_ERC20]: EVENT_PAY_TO_FREELANCER,
    [METHOD_RETURN_FUNDS_TO_CUSTOMER_ETH]: EVENT_RETURN_FUNDS_TO_CUSTOMER,
    [METHOD_RETURN_FUNDS_TO_CUSTOMER_ERC20]: EVENT_RETURN_FUNDS_TO_CUSTOMER,
    [METHOD_BLOCK_CONTRACT]: EVENT_CONTRACT_BLOCKED,
    [METHOD_DISTRIBUTION_FUNDS_FOR_PARTIALS]: EVENT_DISTRIBUTION_FUNDS_FOR_PARTIALS,
    [METHOD_APPROVE]: EVENT_APPROVAL,
}

export const SERVICE_FEE_PRECISION_V1 = 100
export const SERVICE_FEE_PRECISION_V2 = 1000