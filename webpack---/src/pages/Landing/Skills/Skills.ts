import Vue from 'vue'
import { SERVICE_BY_SKILL, SKILLS_LIST } from '@/constants-ts/routes'

export default Vue.extend<any, any, any, any>({
  data () {
    return {
      SERVICE_BY_SKILL,
      SKILLS_LIST,
      skills: [
        {
          name: 'Web, Mobile & Software Dev',
          url: 'development',
        },
        {
          name: 'IT & Networking',
          url: 'it-and-networking',
        },
        {
          name: 'Data Science & Analytics',
          url: 'data-science-and-analytics',
        },
        {
          name: 'Accounting & Consulting',
          url: 'accounting-and-consulting',
        },
        {
          name: 'Legal',
          url: 'legal',
        },
        {
          name: 'Translation',
          url: 'translation',
        },
        {
          name: 'Design & Creative',
          url: 'design-and-creative',
        },
        {
          name: 'Engineering & Architecture',
          url: 'engineering-and-architecture',
        },
        {
          name: 'Writing',
          url: 'writing',
        },
        {
          name: 'Admin Support',
          url: 'support',
        },
        {
          name: 'Customer Service',
          url: 'customer-service',
        },
        {
          name: 'Sales & Marketing',
          url: 'sales-and-marketing',
        },
        {
          name: 'Gaming',
          url: 'gaming',
        },
      ]
    }
  },
})
