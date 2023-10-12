export const STATUS_PENDING = 1
export const STATUS_CONFIRMED = 2
export const STATUS_ERROR = 3
export const STATUS_APPLIED = 4
export const STATUS_DECLINED = 5

export const TX_STATUSES = {
    [STATUS_PENDING]: {
        title: 'Pending',
        icon: 'circle-pending'
    },
    [STATUS_CONFIRMED]: {
        title: 'Confirmed',
        icon: 'circle-success'
    },
    [STATUS_ERROR]: {
        title: 'Error',
        icon: 'circle-failed'
    },
    [STATUS_APPLIED]: {
        title: 'Confirmed',
        icon: 'circle-success'
    },
    [STATUS_DECLINED]: {
        title: 'Declined',
        icon: 'circle-error'
    },
}

export const EVENT_CONTRACT_CREATED = 'ContractCreated'
export const EVENT_CONTRACT_SIGNED = 'ContractSigned'
export const EVENT_CONTRACT_SIGN_REVOKED = 'ContractSignRevoked'
export const EVENT_CONTRACT_STARTED = 'ContractStarted'
export const EVENT_CONTRACT_DISPUTE_RESOLVED = 'ContractDisputeResolved'
export const EVENT_CONTRACT_TERMINATION_REQUESTED = 'ContractTerminationRequested'
export const EVENT_CONTRACT_TERMINATION_REQUEST_CANCELLED = 'ContractTerminationRequestCancelled'
export const EVENT_CONTRACT_TERMINATED = 'ContractTerminated'
export const EVENT_CONTRACT_STATE_TRANSITIONED = 'ContractStateTransitioned'
export const EVENT_CONTRACT_OPERATION_LOGGED = 'ContractOperationLogged'
export const EVENT_CONTRACT_WITHDRAW_OPERATION_LOGGED = 'ContractWithdrawOperationLogged'
export const EVENT_CONTRACT_OWNERSHIP_TRANSFERRED = 'OwnershipTransferred'
export const EVENT_TASK_STATE_CHANGED = 'TaskStateChanged'
export const EVENT_RELEASED_PAYMENT = 'ReleasedPayment'
export const EVENT_CONTRACT_BLOCKED = 'ContractBlocked'
export const EVENT_PAY_TO_FREELANCER = 'PayToFreelancer'
export const EVENT_RETURN_FUNDS_TO_CUSTOMER = 'ReturnFundsToCustomer'
export const EVENT_DISTRIBUTION_FUNDS_FOR_PARTIALS = 'DistributionFundsForPartials'

export const EVENT_CONTRACT_CREATED_V2 = 'ContractCreated'
export const EVENT_PAYED_TO_FREELANCER_V2 = 'PayedToFreelancer'
export const EVENT_REFUNDED_TO_CUSTOMER_V2 = 'RefundedToCustomer'
export const EVENT_DISTRIBUTED_FOR_PARTIALS_V2 = 'DistributedForPartials'