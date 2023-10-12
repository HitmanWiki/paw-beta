export const TIME_FIXED = 1
export const TIME_HOURLY = 2

export const STATUS_DRAFT = 1
export const STATUS_PUBLISHED = 2

export const OFFER_STATUS_NEW = 1
export const OFFER_STATUS_DECLINED_FREELANCER = 2
export const OFFER_STATUS_DECLINED_CUSTOMER = 3
export const OFFER_STATUS_CONFIRMED_FREELANCER = 4
export const OFFER_STATUS_CONFIRMED_CUSTOMER = 5

export const OFFER_STATUSES = {
    [OFFER_STATUS_NEW]: {
        name: 'Offer sent',
        description: 'Customer has made an offer - awaiting response by freelancer',
    },
    [OFFER_STATUS_DECLINED_FREELANCER]: {
        name: 'Offer declined',
        description: 'Freelancer has declined the gig offer',
        color: 'red',
    },
    [OFFER_STATUS_DECLINED_CUSTOMER]: {
        name: 'Offer cancelled',
        description: 'Customer has cancelled the gig',
        color: 'red',
    },
    [OFFER_STATUS_CONFIRMED_FREELANCER]: {
        name: 'Confirmed',
        description: 'Freelancer has accepted the offer and confirmed terms - awaiting payment by customer',
    },
    [OFFER_STATUS_CONFIRMED_CUSTOMER]: {
        name: 'Confirmed',
        description: 'Freelancer has accepted the offer and confirmed terms - awaiting payment by customer',
    }
}

export const JOB_STATUS_IN_PROGRESS = 1
export const JOB_STATUS_PAYED = 2
export const JOB_STATUS_RETURNED = 3
export const JOB_STATUS_BLOCKED = 4
export const JOB_STATUS_DISPUTED = 5

export const JOB_STATUSES = {
    [JOB_STATUS_IN_PROGRESS]: {
        name: 'In Progress',
        description: 'Customer has escrowed funds and freelancer is working on the task',
    },
    [JOB_STATUS_PAYED]: {
        name: 'Paid',
        description: 'Task completed and funds paid to freelancer',
    },
    [JOB_STATUS_RETURNED]: {
        name: 'Refunded',
        description: 'Task incomplete/unsatisfactory and funds returned to customer',
        color: 'red',
    },
    [JOB_STATUS_BLOCKED]: {
        name: 'In Dispute',
        description: 'Dispute initiated by freelancer - job frozen',
        color: 'red',
    },
    [JOB_STATUS_DISPUTED]: {
        name: 'Resolved',
        description: 'Dispute resolved by third-party arbitration',
        color: 'red',
    }
}