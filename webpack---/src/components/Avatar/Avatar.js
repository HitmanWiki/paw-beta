import VueTypes from 'vue-types'
import Avatar from '@/models/user/Avatar'
import AccountType, {
    ACCOUNT_TYPES
} from '@/constants/accountTypes'

const SIZES = [40, 80, 180, 360]

export default {
    name: 'lx-avatar',
    props: {
        avatar: Avatar,
        loading: Boolean,
        userId: VueTypes.number.required,
        userType: {
            validator: v => ACCOUNT_TYPES.includes(+v),
        },
        sizes: String,
        defaultUrlSize: VueTypes.oneOf(SIZES).def(40),
        imgAttrs: VueTypes.object.def({})
    },
    computed: {
        accountType() {
            return AccountType.getType(this.userType)
        },
        hasAvatar() {
            return this.avatar ? .src
        },
        defaultSrc() {
            return `/static/images/avatars/user-${(this.userId || 0) % 6}-${this.defaultUrlSize}.png`
        },
        defaultSrcSet() {
            return SIZES.map(size => `/static/images/avatars/user-${(this.userId || 0) % 6}-${size}.png ${size}w`).join(', ')
        },
        src() {
            return this.hasAvatar ? this.avatar.src : this.defaultSrc
        },
        srcset() {
            return this.hasAvatar ? this.avatar.srcSet : this.defaultSrcSet
        },
        srcSizes() {
            return this.sizes || `${this.defaultUrlSize}px`
        },
        isSmall() {
            return Number.parseInt(this.srcSizes) < 64
        },
    },
}