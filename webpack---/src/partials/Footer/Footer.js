import {
    ABOUT_US,
    BROWSE_JOBS,
    FREELANCERS_LIST,
    BLOG,
    SKILLS_LIST,
    PREMIUM,
    LANDING,
    SERVICES
} from '@/constants-ts/routes'

export default {
    data() {
        return {
            ABOUT_US,
            BROWSE_JOBS,
            FREELANCERS_LIST,
            BLOG,
            SKILLS_LIST,
            PREMIUM,
            SERVICES,
            currentYear: new Date().getFullYear(),
        }
    },
    methods: {
        onClickMain() {
            if (this.$route.name === LANDING) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        },
        exploreGigs() {},
    },
}