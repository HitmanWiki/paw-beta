import * as routes from '@/constants-ts/routes'
import lazyLoadPage from '../lazyLoadPage'

export default [{
        path: '/jobs/edit/id:id(\\d+)',
        name: routes.JOB_EDIT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/JobAddEdit/JobAddEdit.vue')),
        meta: {
            layout: 'private-new',
            requiresCustomer: true,
        }
    },
    {
        path: '/dashboard',
        name: routes.DASHBOARD,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Dashboard/Dashboard.vue')),
        meta: {
            layout: 'private-new',
        }
    },
    {
        path: '/notifications',
        name: routes.USER_NOTIFICATIONS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Notifications/Notifications.vue')),
        meta: {
            layout: 'private-new',
        }
    },
    {
        path: '/profile-settings',
        name: routes.PROFILE_SETTINGS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/ProfileSettings/ProfileSettings.vue')),
        meta: {
            layout: 'private-new',
        }
    },
    {
        path: '/settings',
        redirect: {
            name: routes.SECURITY
        },
        name: routes.SETTINGS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Settings/Settings.vue')),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'security',
                name: routes.SECURITY,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'notifications',
                name: routes.NOTIFICATIONS,
                meta: {
                    layout: 'private-new',
                },
            },
        ]
    },
    {
        path: '/wallets',
        name: routes.WALLETS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Wallets/Wallets.vue')),
        meta: {
            layout: 'private-new',
        }
    },
    {
        path: '/referrals',
        name: routes.REFERRALS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Referrals/Referrals.vue')),
        meta: {
            layout: 'private-new',
        },
    },
    {
        path: '/jobs/my/id:id(\\d+)',
        name: routes.JOB_DETAILS_ADMIN,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Jobs/JobDetails/JobDetailsAdmin/JobDetailsAdmin.vue')
        ),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'description',
                name: routes.JOB_DETAILS_ADMIN_DESCRIPTION,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'applications',
                name: routes.JOB_DETAILS_ADMIN_APPLICATIONS,
                meta: {
                    layout: 'private-new',
                },
            },
        ]
    },
    {
        path: '/jobs/my',
        name: routes.MY_JOBS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Jobs/MyJobs/MyJobs.vue')),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'negotiations',
                name: routes.JOBS_NEGOTIATIONS,
                meta: {
                    requiresFreelancer: true,
                    redirectRoute: routes.JOBS_POSTED,
                    layout: 'private-new',
                },
            },
            {
                path: 'archive',
                name: routes.JOBS_ARCHIVED,
                meta: {
                    requiresFreelancer: true,
                    redirectRoute: routes.JOBS_POSTED,
                    layout: 'private-new',
                },
            },
            {
                path: 'to-do',
                name: routes.JOBS_TO_DO,
                meta: {
                    requiresFreelancer: true,
                    redirectRoute: routes.JOBS_IN_PROGRESS,
                    layout: 'private-new',
                },
            },
            {
                path: 'in-progress',
                name: routes.JOBS_IN_PROGRESS,
                meta: {
                    requiresCustomer: true,
                    redirectRoute: routes.JOBS_TO_DO,
                    layout: 'private-new',
                },
            },
            {
                path: 'all',
                name: routes.JOBS_ALL,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'completed',
                name: routes.JOBS_COMPLETED,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'posted',
                name: routes.JOBS_POSTED,
                meta: {
                    requiresCustomer: true,
                    redirectRoute: routes.JOBS_OFFERS,
                    layout: 'private-new',
                },
            },
        ]
    },
    {
        path: '/jobs/id:id(\\d+)/chat',
        name: routes.JOB_CHAT_BY_ID,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/JobChat/JobChat.vue')),
        meta: {
            layout: 'private-new',
            layoutProps: {
                classes: 'job-chat-layout'
            }
        }
    },
    {
        path: '/jobs/:slug-:id(\\d+)/chat',
        name: routes.JOB_CHAT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/JobChat/JobChat.vue')),
        meta: {
            layout: 'private-new',
            layoutProps: {
                classes: 'job-chat-layout'
            }
        }
    },
    {
        path: '/gigs/my',
        name: routes.SERVICE_MY,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Gigs/MyGigs/MyGigs.vue')),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'posted',
                name: routes.SERVICE_MY_POSTED,
                meta: {
                    requiresFreelancer: true,
                    redirectRoute: routes.SERVICE_MY_OFFERS,
                    layout: 'private-new',
                },
            },
            {
                path: 'drafts',
                name: routes.SERVICE_MY_DRAFTS,
                meta: {
                    requiresFreelancer: true,
                    redirectRoute: routes.SERVICE_MY_OFFERS,
                    layout: 'private-new',
                },
            },
            {
                path: 'offers',
                name: routes.SERVICE_MY_OFFERS,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'in-progress',
                name: routes.SERVICE_MY_IN_PROGRESS,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'completed',
                name: routes.SERVICE_MY_COMPLETED,
                meta: {
                    layout: 'private-new',
                },
            },
        ],
    },
    {
        path: '/gigs/edit/id:id(\\d+)',
        name: routes.SERVICE_EDIT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-gigs" */ '@/pages/Gigs/GigAddEdit/GigAddEdit.vue')),
        meta: {
            requiresFreelancer: true,
            layout: 'private-new',
        },
    },

    {
        path: '/gigs/id:id(\\d+)/chat',
        name: routes.SERVICE_CHAT_BY_ID,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/GigChat/GigChat.vue')),
        meta: {
            layout: 'private-new',
            layoutProps: {
                classes: 'gig-chat-layout'
            }
        }
    },
    {
        path: '/gigs/:slug-:id(\\d+)/chat',
        name: routes.SERVICE_CHAT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/GigChat/GigChat.vue')),
        meta: {
            layout: 'private-new',
            layoutProps: {
                classes: 'gig-chat-layout'
            }
        }
    },
    {
        path: '/vacancies/my/id:id(\\d+)',
        name: routes.VACANCY_DETAILS_ADMIN,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-jobs" */ '@/pages/Vacancies/VacancyDetailsNew/VacancyDetailsAdmin/VacancyDetailsAdmin.vue')
        ),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'description',
                name: routes.VACANCY_DETAILS_ADMIN_DESCRIPTION,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'applications',
                name: routes.VACANCY_DETAILS_ADMIN_APPLICATIONS,
                meta: {
                    layout: 'private-new',
                },
            },
        ]
    },
    {
        path: '/vacancies/my',
        name: routes.VACANCIES_MY,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Vacancies/MyVacancies/MyVacancies.vue')
        ),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'published',
                name: routes.VACANCIES_MY_PUBLISHED,
                meta: {
                    layout: 'private-new',
                    requiresCustomer: true,
                    redirectRoute: routes.SERVICE_MY,
                },
            },
            {
                path: 'drafts',
                name: routes.VACANCIES_MY_DRAFTS,
                meta: {
                    layout: 'private-new',
                    requiresCustomer: true,
                    redirectRoute: routes.SERVICE_MY,
                },
            },
            {
                path: 'archived',
                name: routes.VACANCIES_MY_ARCHIVED,
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'all',
                name: routes.VACANCIES_MY_ALL,
                meta: {
                    layout: 'private-new',
                    requiresFreelancer: true,
                    redirectRoute: routes.MY_JOBS,
                },
            },
            {
                path: 'applied',
                name: routes.VACANCIES_MY_APPLIED,
                meta: {
                    layout: 'private-new',
                    requiresFreelancer: true,
                    redirectRoute: routes.MY_JOBS,
                },
            },
            {
                path: 'in-progress',
                name: routes.VACANCIES_MY_IN_PROGRESS,
                meta: {
                    layout: 'private-new',
                    requiresFreelancer: true,
                    redirectRoute: routes.MY_JOBS,
                },
            },
        ]
    },

    {
        path: '/vacancies/edit/id:id(\\d+)',
        name: routes.VACANCY_EDIT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "public-page-vacancies" */ '@/pages/Vacancies/AddEditVacancyNew/AddEditVacancyNew.vue')
        ),
        meta: {
            layout: 'private-new',
            requiresCustomer: true,
        }
    },
    {
        path: '/vacancies/id:id(\\d+)/chat',
        name: routes.VACANCY_CHAT_BY_ID,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/VacancyChat/VacancyChat.vue')),
        meta: {
            layout: 'private-new',
            layoutProps: {
                classes: 'vacancy-chat-layout'
            }
        }
    },
    {
        path: '/vacancies/:slug-:id(\\d+)/chat',
        name: routes.VACANCY_CHAT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/VacancyChat/VacancyChat.vue')),
        meta: {
            layout: 'private-new',
            layoutProps: {
                classes: 'vacancy-chat-layout'
            }
        }
    },
    {
        path: '/chat',
        name: routes.CHAT,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/ChatRooms/ChatRooms.vue')
        ),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: 'freelance',
                name: routes.CHAT_FREELANCE,
                component: () => lazyLoadPage(
                    import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/ChatRooms/ChatRooms.vue')
                ),
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'full-time',
                name: routes.CHAT_FULL_TIME,
                component: () => lazyLoadPage(
                    import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/ChatRooms/ChatRooms.vue')
                ),
                meta: {
                    layout: 'private-new',
                },
            },
            {
                path: 'archived',
                name: routes.CHAT_ARCHIVED,
                component: () => lazyLoadPage(
                    import ( /* webpackChunkName: "private-pages" */ '@/pages/Chat/ChatRooms/ChatRooms.vue')
                ),
                meta: {
                    layout: 'private-new',
                },
            },
        ]
    },
    {
        path: '/bookmarks',
        name: routes.BOOKMARKS,
        component: () => lazyLoadPage(
            import ( /* webpackChunkName: "private-pages" */ '@/pages/Bookmarks/Bookmarks.vue')
        ),
        meta: {
            layout: 'private-new',
        },
        children: [{
                path: '/bookmarks/gigs',
                name: routes.GIG_BOOKMARKS,
                component: () => lazyLoadPage(
                    import ( /* webpackChunkName: "private-pages" */ '@/pages/Bookmarks/Bookmarks.vue')
                ),
                meta: {
                    layout: 'private-new',
                }
            },
            {
                path: '/bookmarks/jobs',
                name: routes.JOB_BOOKMARKS,
                component: () => lazyLoadPage(
                    import ( /* webpackChunkName: "private-pages" */ '@/pages/Bookmarks/Bookmarks.vue')
                ),
                meta: {
                    layout: 'private-new',
                }
            },
            {
                path: '/bookmarks/vacancies',
                name: routes.VACANCY_BOOKMARKS,
                component: () => lazyLoadPage(
                    import ( /* webpackChunkName: "private-pages" */ '@/pages/Bookmarks/Bookmarks.vue')
                ),
                meta: {
                    layout: 'private-new',
                }
            },
        ]
    },
    // {
    //   path: '/transactions',
    //   name: routes.TRANSACTIONS,
    //   component: () => lazyLoadPage(import(/* webpackChunkName: "private-pages" */ '@/pages/TransactionHistory/TransactionHistory.vue')),
    // },
]