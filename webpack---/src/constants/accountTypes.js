export const USER_ACCOUNT_SIMPLE = 1
export const USER_ACCOUNT_PREMIUM_BRONZE = 2
export const USER_ACCOUNT_PREMIUM_SILVER = 3
export const USER_ACCOUNT_PREMIUM_GOLD = 4
export const USER_ACCOUNT_PREMIUM_PLATINUM = 5
export const ACCOUNT_TYPES = [
    USER_ACCOUNT_SIMPLE,
    USER_ACCOUNT_PREMIUM_BRONZE,
    USER_ACCOUNT_PREMIUM_SILVER,
    USER_ACCOUNT_PREMIUM_GOLD,
    USER_ACCOUNT_PREMIUM_PLATINUM,
]

class AccountType {
    static USER_ACCOUNT_SIMPLE = new AccountType({
        key: 1,
        title: 'Simple',
        shortTitle: 'N/A',
        amount: [0, 10],
        returnCommission: 5,
        referralBonuses: 50,
        highlighted: false,
        priority: 0,
        color: '#000000',
    })
    static USER_ACCOUNT_PREMIUM_BRONZE = new AccountType({
        key: 2,
        title: 'Bronze client',
        shortTitle: 'Bronze',
        icon: 'premium-bronze',
        amount: [10, 30],
        returnCommission: 25,
        referralBonuses: 60,
        priority: 20,
        color: '#BE8C58',
    })
    static USER_ACCOUNT_PREMIUM_SILVER = new AccountType({
        key: 3,
        title: 'Silver client',
        shortTitle: 'Silver',
        icon: 'premium-silver',
        amount: [30, 60],
        returnCommission: 50,
        referralBonuses: 70,
        priority: 30,
        color: '#BBB9B9',
    })
    static USER_ACCOUNT_PREMIUM_GOLD = new AccountType({
        key: 4,
        title: 'Gold client',
        shortTitle: 'Gold',
        icon: 'premium-gold',
        amount: [60, 100],
        returnCommission: 75,
        referralBonuses: 80,
        priority: 40,
        color: '#FFD700',
    })
    static USER_ACCOUNT_PREMIUM_PLATINUM = new AccountType({
        key: 5,
        title: 'Platinum client',
        shortTitle: 'Platinum',
        icon: 'premium-platinum',
        amount: 100,
        returnCommission: 100,
        referralBonuses: 90,
        priority: 60,
        color: '#3848D8',
    })

    static getType(key) {
        return Object.values(this).find(type => type.key === +key) || AccountType.USER_ACCOUNT_SIMPLE
    }

    get isPremium() {
        return this.key > 1
    }

    constructor({
        highlighted = true,
        ...fields
    }) {
        this.highlighted = highlighted
        Object.entries(fields).forEach(([key, val]) => {
            this[key] = val
        })
    }
}

export default AccountType