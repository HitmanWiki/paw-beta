import Vue from 'vue'
import PublicFooter from '@/partials/PublicFooter/PublicFooter.vue'
import LxHeader from '@/partials/LxHeader/LxHeader.vue'
import IntroSection from './IntroSection/IntroSection.vue'
import AmountSection from './AmountSection/AmountSection.vue'
import ProfitsSection from './ProfitsSection/ProfitsSection.vue'
import ApplicationSection from './ApplicationSection/ApplicationSection.vue'
import GetStartedSection from './GetStartedSection/GetStartedSection.vue'
import PayProcessSection from './PayProcessSection/PayProcessSection.vue'
import ChooseTalentSection from './ChooseTalentSection/ChooseTalentSection.vue'
import StartCareerSection from './StartCareerSection/StartCareerSection.vue'
import SubscribeSection from './SubscribeSection/SubscribeSection.vue'
import WeHelpSection from './WeHelpSection/WeHelpSection.vue'

export default Vue.extend<any, any, any, any>({
  components: {
    PublicFooter,
    LxHeader,
    IntroSection,
    AmountSection,
    ProfitsSection,
    ApplicationSection,
    GetStartedSection,
    PayProcessSection,
    ChooseTalentSection,
    StartCareerSection,
    SubscribeSection,
    WeHelpSection,
  },
  metaInfo: {
    title: 'Post a full-time job on LaborX',
  },
})
