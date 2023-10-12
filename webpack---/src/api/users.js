import Channel from '@/models/user/Channel'
import Experience from '@/models/user/Experience'
import Portfolio from '@/models/user/Portfolio'
import {
    BACKEND_PUBLIC,
    BACKEND_PRIVATE
} from './base'

export async function getUserInfo() {
    return BACKEND_PRIVATE.get('/users/info')
}

export async function getActiveProfile() {
    return BACKEND_PRIVATE.get('/me/profiles/get-active-profile')
}

export async function getMyFreelancerProfile() {
    return BACKEND_PRIVATE.get('/me/profiles/freelancer/get-profile')
}

export async function getMyCustomerProfile() {
    return BACKEND_PRIVATE.get('/me/profiles/customer/get-profile')
}

export async function saveMyGeneralFreelancerProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/save-general-info', {
        payload
    })
}

export async function saveMyGeneralCustomerProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/customer/save-general-info', {
        payload
    })
}

export async function saveMyWorkExperienceProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/upsert-work-experience', {
        payload
    })
}

export async function saveEducationsProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/upsert-education', {
        payload
    })
}

export async function saveMyFreelancerInfoProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/save-freelance-info', {
        payload
    })
}

export async function saveMyFullTimeInfoProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/save-full-time-info', {
        payload
    })
}

export async function saveFreelancerChannelsProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/upsert-socials', {
        payload
    })
}

export async function saveFreelancerPortfolioProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/freelancer/upsert-portfolio', {
        payload
    })
}

export async function saveCustomerChannelsProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/customer/upsert-socials', {
        payload
    })
}

export async function saveCustomerIndividualInfoProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/customer/save-individual-info', {
        payload
    })
}

export async function saveCustomerCompanyInfoProfile(payload) {
    return BACKEND_PRIVATE.post('/me/profiles/customer/save-company-info', {
        payload
    })
}

export async function updateGeneralInfo(payload) {
    return BACKEND_PRIVATE.put('/me/profiles/save-active-profile', {
        payload
    })
}

export async function switchRole(type) {
    return BACKEND_PRIVATE.post('/me/users/switch-role', {
        payload: {
            type
        }
    })
}

export async function addRole(payload) {
    return BACKEND_PRIVATE.post('/me/users/add-role', {
        payload
    })
}

export const uploadAvatar = async ({
    x,
    y,
    w,
    h,
    avatar
}) => {
    const formData = new FormData()
    formData.append('avatar', avatar)
    formData.append('x', x)
    formData.append('y', y)
    formData.append('w', w)
    formData.append('h', h)
    return BACKEND_PRIVATE.post('/me/profiles/upload-avatar', formData)
}

export const removeAvatar = async () => {
    return BACKEND_PRIVATE.delete('/me/profiles/remove-avatar')
}

export async function changePassword({
    oldPassword,
    newPassword,
    key
}) {
    return BACKEND_PRIVATE.post('/users/change-password', {
        payload: {
            oldPassword,
            newPassword,
            newPasswordConfirm: newPassword,
            key,
        },
    })
}

export async function get2FASecret() {
    return BACKEND_PRIVATE.get('/users/generate-2fa')
}

export async function enable2FA(key, secret) {
    return BACKEND_PRIVATE.post('/users/enable-2fa', {
        payload: {
            key,
            secret
        }
    })
}

export async function disable2FA(key) {
    return BACKEND_PRIVATE.post('/users/disable-2fa', {
        payload: {
            key
        }
    })
}

export async function changeEmailRequest({
    email,
    key
}) {
    return BACKEND_PRIVATE.post('/users/request-email-change', {
        payload: {
            email,
            key
        }
    })
}

export function confirmEmail(token) {
    return BACKEND_PUBLIC.post('/users/confirm-email-change', {
        payload: {
            token
        }
    })
}

export async function getChannels() {
    const channels = await BACKEND_PRIVATE.get('/me/channels/list')
    return channels.map(Channel.fromServer)
}

export async function setChannels(payload) {
    const channels = await BACKEND_PRIVATE.post('/me/channels/upsert', {
        payload
    })
    return channels.map(Channel.fromServer)
}

export async function getExperience() {
    const experience = await BACKEND_PRIVATE.get('/me/experience/list')
    return experience.map(Experience.fromServer)
}

export async function setExperience(payload) {
    const experience = await BACKEND_PRIVATE.post('/me/experience/upsert', {
        payload
    })
    return experience.map(Experience.fromServer)
}

export async function getPortfolio() {
    const experience = await BACKEND_PRIVATE.get('me/portfolio/list')
    return experience.map(Portfolio.fromServer)
}

export async function setPortfolio(payload) {
    const experience = await BACKEND_PRIVATE.post('/me/portfolio/upsert', {
        payload
    })
    return experience.map(Portfolio.fromServer)
}

export async function deleteUser(payload) {
    return BACKEND_PRIVATE.post('/me/users/remove', {
        payload
    })
}

export async function getActiveRole() {
    return BACKEND_PRIVATE.get('/me/init')
}