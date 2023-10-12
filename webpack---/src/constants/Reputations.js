class Reputations {
    // Documents
    static EDUCATION = new Reputations(1, 'Education')
    static EDUCATION_DOCS = new Reputations(2, 'Education documents')
    static ADDITIONAL_EDUCATION = new Reputations(3, 'Additional education')
    static ADDITIONAL_EDUCATION_DOCS = new Reputations(4, 'Additional education documents')
    static KYC = new Reputations(5, 'KYC Passed')

    // Profiles
    static REGISTRATION_DATE = new Reputations(6, 'REGISTRATION_DATE')
    static GENERAL_PROFILE = new Reputations(7, 'GENERAL_PROFILE')
    static CLIENT_PROFILE = new Reputations(8, 'CLIENT_PROFILE')
    static CLIENT_PROFILE_DOCS = new Reputations(9, 'CLIENT_PROFILE_DOCS')
    static BIO = new Reputations(10, 'BIO')
    static EXPERIENCE = new Reputations(11, 'EXPERIENCE')
    static PORTFOLIO = new Reputations(12, 'PORTFOLIO')
    static LANGUAGES = new Reputations(13, 'LANGUAGES')

    // Contracts
    static BUDGET = new Reputations(14, 'BUDGET')
    static TERMINATION_FAULT = new Reputations(15, 'TERMINATION_FAULT')
    static DISPUTE_FAULT = new Reputations(16, 'DISPUTE_FAULT')
    static DEADLINES = new Reputations(17, 'DEADLINES')
    static DEADLINES_FAULT = new Reputations(18, 'DEADLINES_FAULT')

    // Reviews
    static COST = new Reputations(19, 'COST')
    static COMPETENCE = new Reputations(20, 'COMPETENCE')
    static MOTIVATION = new Reputations(21, 'MOTIVATION')
    static RESPONSIBILITY = new Reputations(22, 'RESPONSIBILITY')
    static COMMUNICATION_SKILLS = new Reputations(23, 'COMMUNICATION_SKILLS')
    static REWARD = new Reputations(24, 'REWARD')
    static PROJECT_SCOPE = new Reputations(25, 'PROJECT_SCOPE')
    static INVOLVEMENT = new Reputations(26, 'INVOLVEMENT')
    static FLEXIBILITY = new Reputations(27, 'FLEXIBILITY')

    static DOCUMENTS = 1
    static PROFILE = 2
    static CONTRACT = 3
    static REVIEWS = 4
    static GIGS = 5
    static JOBS = 6

    static getReputation(key) {
        return Object.values(this).find(rep => rep.key === key)
    }

    constructor(key, title) {
        this.key = key
        this.title = title
    }
}

export default Reputations