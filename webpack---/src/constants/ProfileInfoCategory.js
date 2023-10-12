import {
    SETTINGS,
    JOB_ADD,
    SERVICE_ADD,
    PROFILE_SETTINGS
} from '../constants-ts/routes'

class ProfileInfoCategory {
    static CATEGORY_NAME = new ProfileInfoCategory({
        id: 1,
        profit: 15,
        title: 'Name',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#name'
        }
    })
    static CATEGORY_AVATAR = new ProfileInfoCategory({
        id: 2,
        profit: [10, 10, 5],
        title: 'Avatar',
        link: {
            name: PROFILE_SETTINGS
        }
    })
    static CATEGORY_COUNTRY = new ProfileInfoCategory({
        id: 3,
        profit: [2, 4, 4],
        title: ['City', 'City', 'Locations'],
        link: {
            name: PROFILE_SETTINGS,
            hash: '#country'
        }
    })
    static CATEGORY_WEBSITE = new ProfileInfoCategory({
        id: 4,
        profit: [2, 5, 10],
        title: 'Website',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#website'
        },
    })
    static CATEGORY_DESCRIPTION = new ProfileInfoCategory({
        id: 5,
        profit: [15, 20, 20],
        title: 'Description',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#description'
        },
    })
    static CATEGORY_PREFERRED_PAYMENT_OPTIONS = new ProfileInfoCategory({
        id: 6,
        profit: [2, 10, 5],
        title: 'Preferred Payment Options',
        link: [{
                name: PROFILE_SETTINGS,
                query: {
                    tab: 'freelance'
                },
                hash: '#payments'
            },
            {
                name: PROFILE_SETTINGS,
                hash: '#payments'
            },
        ]
    })
    static CATEGORY_CONTACTS = new ProfileInfoCategory({
        id: 7,
        profit: 5,
        title: 'Contacts',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#contacts'
        },
    })
    static CATEGORY_JOBS = new ProfileInfoCategory({
        id: 8,
        profit: 10,
        title: 'Adding Jobs',
        link: {
            name: JOB_ADD
        }
    })
    static CATEGORY_ABOUT_ME = new ProfileInfoCategory({
        id: 9,
        profit: 15,
        title: 'About me',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#description'
        },
    })
    static CATEGORY_SPECIALIZATION = new ProfileInfoCategory({
        id: 10,
        profit: 5,
        title: 'Specialization',
        link: {
            name: PROFILE_SETTINGS,
            query: {
                tab: 'freelance'
            },
            hash: '#specialization'
        },
    })
    // static CATEGORY_CITY = new ProfileInfoCategory({
    //   id: 11,
    //   profit: 2,
    //   title: 'City',
    //   link: { name: PROFILE_SETTINGS, hash: '#city' },
    // })
    static CATEGORY_SKILLS = new ProfileInfoCategory({
        id: 12,
        profit: [15, 15, 5],
        title: ['Specializations', 'Specializations', 'Markets'],
        link: {
            name: PROFILE_SETTINGS,
            hash: '#skills'
        },
    })
    static CATEGORY_EXPERIENCE = new ProfileInfoCategory({
        id: 13,
        profit: 4,
        title: 'Experience',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#experience'
        },
    })
    static CATEGORY_PORTFOLIO = new ProfileInfoCategory({
        id: 14,
        profit: 10,
        title: 'Portfolio',
        link: {
            name: PROFILE_SETTINGS,
            query: {
                tab: 'freelance'
            },
            hash: '#portfolio'
        },
    })
    static CATEGORY_GIGS = new ProfileInfoCategory({
        id: 15,
        profit: 2,
        title: 'Publishing Gigs',
        link: {
            name: SERVICE_ADD
        }
    })
    static EMPLOYEES = new ProfileInfoCategory({
        id: 16,
        profit: 5,
        title: 'Employees',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#employees'
        },
    })
    static POSITION = new ProfileInfoCategory({
        id: 17,
        profit: 5,
        title: 'Position',
        link: {
            name: PROFILE_SETTINGS,
            query: {
                tab: 'full-time'
            },
            hash: '#position'
        },
    })
    static EDUCATION = new ProfileInfoCategory({
        id: 18,
        profit: 2,
        title: 'Education',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#education'
        },
    })
    static CV = new ProfileInfoCategory({
        id: 19,
        profit: 2,
        title: 'CV',
        link: {
            name: PROFILE_SETTINGS,
            query: {
                tab: 'full-time'
            },
            hash: '#cv'
        },
    })
    static RATE = new ProfileInfoCategory({
        id: 20,
        profit: 2,
        title: 'Rate',
        link: {
            name: PROFILE_SETTINGS,
            query: {
                tab: 'freelance'
            },
            hash: '#rate'
        },
    })
    static CATEGORY_YEARS_OF_EXPERIENCE = new ProfileInfoCategory({
        id: 21,
        profit: 2,
        title: 'Years of experience',
        link: {
            name: PROFILE_SETTINGS,
            query: {
                tab: 'full-time'
            },
            hash: '#years'
        },
    })
    static CATEGORY_FIRST_SAVE = new ProfileInfoCategory({
        id: 22,
        profit: 1,
        title: 'Profile type',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#type'
        },
    })
    static COMPANY_LOGO = new ProfileInfoCategory({
        id: 23,
        profit: 5,
        title: 'Company logo',
        link: {
            name: PROFILE_SETTINGS,
            hash: '#logo'
        },
    })
    static getCategory(id) {
        return Object.values(this).find(type => type.id === +id)
    }

    constructor({
        link = {
            name: SETTINGS
        },
        ...fields
    }) {
        this.link = link
        Object.entries(fields).forEach(([key, val]) => {
            this[key] = val
        })
    }

    getProfit({
        isClient,
        isClientPrivatePerson
    }) {
        if (Array.isArray(this.profit)) {
            if (isClient) {
                return isClientPrivatePerson ? this.profit[1] : this.profit[this.profit.length - 1]
            }
            return this.profit[0]
        }
        return this.profit
    }

    getTitle({
        isClient,
        isClientPrivatePerson
    }) {
        if (Array.isArray(this.title)) {
            if (isClient) {
                return isClientPrivatePerson ? this.title[1] : this.title[this.title.length - 1]
            }
            return this.title[0]
        }
        return this.title
    }

    getLink({
        isClient,
        isClientPrivatePerson
    }) {
        if (Array.isArray(this.link)) {
            if (isClient) {
                return isClientPrivatePerson ? this.link[1] : this.link[this.link.length - 1]
            }
            return this.link[0]
        }
        return this.link
    }
}

export default ProfileInfoCategory