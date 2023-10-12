import * as routes from '@/constants-ts/routes'
import Confirm from '@/pages/auth/Confirm/Confirm.vue'
import RegistrationComplete from '@/pages/auth/RegistrationComplete/RegistrationComplete.vue'
import NotFound from '@/pages/NotFound/NotFound.vue'
import {
    Roles
} from '@/constants-ts/user/roles'
import lazyLoadPage from '../lazyLoadPage'

export default [{
        path: '/',
        name: routes.LANDING,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-landing" */ '@/pages/Landing/Landing.vue')),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/hire-talents',
        name: routes.HIRE_LANDING,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-landing" */ '@/pages/HireLanding/HireLanding.vue')),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/index',
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-landing-copy" */ '@/pages/LandingCopy/Landing.vue')),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/main',
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-landing-copy" */ '@/pages/LandingCopy/Landing.vue')),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/blog',
        name: routes.BLOG,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-blog" */ '@/pages/blog/BlogNew/Blog.vue')),
        meta: {
            layout: 'public-new'
        }
    },
    {
        path: '/blog/:slug',
        name: routes.POST,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-blog" */ '@/pages/blog/PostNew/Post.vue')),
        meta: {
            layout: 'public-new'
        }
    },
    {
        path: '/registration-complete',
        name: routes.REGISTRATION_COMPLETE,
        component: RegistrationComplete,
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/auth/confirmation',
        name: routes.AUTH_CONFIRM,
        component: Confirm,
        props: (route) => ({
            token: route.query.token,
            type: 'sign-up'
        }),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/auth/email-confirmation',
        name: routes.EMAIL_CONFIRM,
        component: Confirm,
        props: (route) => ({
            token: route.query.token,
            type: 'email'
        }),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/auth/social',
        name: routes.SOCIAL_CONFIRM,
        component: Confirm,
        props: (route) => ({
            token: route.query.token,
            type: 'social'
        }),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/premium',
        name: routes.PREMIUM,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-premium" */ '@/pages/Premium/Premium.vue')),
        meta: {
            layout: 'public-new'
        }
    },
    {
        path: '/freelancers',
        redirect: {
            name: routes.FREELANCERS_LIST
        },
    },
    {
        path: '/freelancers/:skill',
        redirect: {
            name: routes.FREELANCERS_LIST_BY_SKILL
        },
    },
    {
        path: '/hire',
        name: routes.FREELANCERS_LIST,
        // eslint-disable-next-line max-len
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-freelancers" */ '@/pages/Freelancers/BrowseFreelancers/BrowseFreelancers.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/freelancers/users/id:id(\\d+)',
        name: routes.FREELANCER_PROFILE,
        // eslint-disable-next-line max-len
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-freelancers" */ '@/pages/FreelancerProfile/FreelancerProfile.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new'
        }
    },
    {
        path: '/hire/:skill',
        name: routes.FREELANCERS_LIST_BY_SKILL,
        // eslint-disable-next-line max-len
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-freelancers" */ '@/pages/Freelancers/BrowseFreelancers/BrowseFreelancers.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new'
        }
    },
    {
        path: '/customers/users/id:id(\\d+)',
        name: routes.CUSTOMER_PROFILE,
        component: () =>
            lazyLoadPage(
                import ( /* webpackChunkName: "public-page-customers" */ '@/pages/CustomerProfile/CustomerProfile.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new'
        }
    },
    {
        path: '/jobs',
        name: routes.BROWSE_JOBS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/BrowseJobs/BrowseJobs.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            layoutProps: {
                classes: 'browse-jobs-layout'
            }
        }
    },
    {
        path: '/jobs/add',
        name: routes.JOB_ADD,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/JobAddEdit/JobAddEdit.vue')),
        meta: {
            requiresCustomer: true,
            redirectRoute: routes.SERVICE_ADD,
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            layoutProps: {
                theme: 'gray',
            }
        }
    },
    {
        path: '/jobs/id:id(\\d+)',
        name: routes.JOB_DETAILS_BY_ID,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/JobDetails/JobDetailsView/JobDetailsView.vue')
        ),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/jobs/:slug-:id(\\d+)',
        name: routes.JOB_DETAILS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/JobDetails/JobDetailsView/JobDetailsView.vue')
        ),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/jobs/:skill',
        name: routes.BROWSE_JOBS_BY_SKILL,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/BrowseJobs/BrowseJobs.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            layoutProps: {
                classes: 'browse-jobs-layout'
            }
        }
    },
    {
        path: '/skills',
        name: routes.SKILLS_LIST,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-skills" */ '@/pages/Skills/Skills.vue')),
        meta: {
            layout: 'public-new'
        }
    },
    {
        path: '/about-us',
        name: routes.ABOUT_US,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-about" */ '@/pages/AboutUs/AboutUs.vue')),
        meta: {
            layout: 'public-new'
        }
    },
    {
        path: '/gigs',
        name: routes.SERVICES,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-gigs" */ '@/pages/Gigs/BrowseGigs/BrowseGigs.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            layoutProps: {
                classes: 'browse-gigs-layout'
            }
        }
    },
    {
        path: '/gigs/add',
        name: routes.SERVICE_ADD,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-gigs" */ '@/pages/Gigs/GigAddEdit/GigAddEdit.vue')),
        meta: {
            requiresFreelancer: true,
            redirectRoute: routes.JOB_ADD,
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            layoutProps: {
                theme: 'gray',
            },
        },
    },
    {
        path: '/gigs/add/axie',
        redirect: {
            name: routes.SERVICE_ADD
        },
    },
    {
        path: '/gigs/id:id(\\d+)',
        name: routes.SERVICE_DETAILS_BY_ID,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-gigs" */ '@/pages/Gigs/GigDetails/GigDetails.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/gigs/:slug-:id(\\d+)',
        name: routes.SERVICE_DETAILS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-gigs" */ '@/pages/Gigs/GigDetails/GigDetails.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/gigs/:skill',
        name: routes.SERVICE_BY_SKILL,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-gigs" */ '@/pages/Gigs/BrowseGigs/BrowseGigs.vue')),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            layoutProps: {
                classes: 'browse-gigs-layout'
            }
        }
    },
    {
        path: '/services',
        redirect: {
            name: routes.SERVICES
        },
    },
    {
        path: '/services/id:id(\\d+)',
        redirect: {
            name: routes.SERVICE_DETAILS_BY_ID
        },
    },
    {
        path: '/services/:skill',
        redirect: {
            name: routes.SERVICE_BY_SKILL
        },
    },
    {
        path: '/vacancies',
        name: routes.VACANCIES,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/Vacancies/BrowseVacanciesNew/BrowseVacanciesNew.vue')
        ),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/vacancies/id:id(\\d+)',
        name: routes.VACANCY_DETAILS_BY_ID,
        component: () => lazyLoadPage(
            // eslint-disable-next-line max-len
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/Vacancies/VacancyDetailsNew/VacancyDetailsView/VacancyDetailsView.vue')
        ),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/vacancies/:slug-:id(\\d+)',
        name: routes.VACANCY_DETAILS,
        component: () => lazyLoadPage(
            // eslint-disable-next-line max-len
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/Vacancies/VacancyDetailsNew/VacancyDetailsView/VacancyDetailsView.vue')
        ),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/vacancies/:slug-:id(\\d+)/apply',
        name: routes.VACANCY_EXTERNAL_APPLY,
        component: () => lazyLoadPage(
            // eslint-disable-next-line max-len
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/Vacancies/ExternalVacancyApplying/ExternalVacancyApplying.vue')
        ),
        meta: {
            withoutLayout: true
        }
    },
    {
        path: '/vacancies/add',
        name: routes.VACANCY_ADD,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/Vacancies/AddEditVacancyNew/AddEditVacancyNew.vue')
        ),
        meta: {
            requiresCustomer: true,
            redirectRoute: routes.SERVICE_ADD,
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
    {
        path: '/job-mining',
        name: routes.JOB_MINING,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-mining" */ '@/pages/JobMining/JobMining.vue')),
        meta: {
            layout: 'public-new'
        }
    },
    {
        path: '/post-a-job',
        name: routes.POST_A_JOB,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/JobTypeSelect/JobTypeSelect.vue')
        ),
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
            requiresCustomer: true,
            redirectRoute: routes.SERVICE_ADD,
        }
    },
    {
        path: '/*',
        name: routes.NOT_FOUND,
        component: NotFound,
        meta: {
            layout: (isLoggedIn) => isLoggedIn ? 'private-new' : 'public-new',
        }
    },
]