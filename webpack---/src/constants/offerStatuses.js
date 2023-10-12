export const OFFER_REVIEW = 1
export const OFFER_DECLINED = 2
export const OFFER_ACCEPTED = 3
export const OFFER_HIRED = 4

export const OFFER_STATUSES = {
    [OFFER_REVIEW]: {
        name: 'New',
        description: 'This offer is new',
    },
    [OFFER_ACCEPTED]: {
        name: 'Accepted',
        description: 'The offer was successfully accepted',
    },
    [OFFER_DECLINED]: {
        name: 'Declined',
        description: 'Offer was rejected',
    },
    [OFFER_HIRED]: {
        name: 'Hired',
        description: 'Offer was hired',
    },
}