import install from '@/utils/installComponents'
// import JobPublishing from './JobPublishing/JobPublishing.vue'
import AddRole from './auth/AddRole/AddRole.vue'
import Confirm2FA from './Confirm2FA/Confirm2FA.vue'
import CompositeModal from './CompositeModal/CompositeModal.vue'
import CompositeModalNew from './CompositeModalNew/CompositeModal.vue'
import Login from './auth/Login/Login.vue'
import SignUp from './auth/SignUp/SignUp.vue'
import SignUpSocial from './auth/SignUpSocial/SignUpSocial.vue'
import Resend from './auth/Resend/Resend.vue'
import Forgot from './auth/Forgot/Forgot.vue'
import Reset from './auth/Reset/Reset.vue'
import ScamAlert from './ScamAlert/ScamAlert.vue'
import SuccessModal from './SuccessModal/SuccessModal.vue'

const components = {
    // JobPublishing,
    AddRole,
    Confirm2FA,
    CompositeModal,
    CompositeModalNew,
    Login,
    SignUp,
    SignUpSocial,
    Resend,
    Forgot,
    Reset,
    ScamAlert,
    SuccessModal,
}

export default {
    ...components,
    install: install(components),
}