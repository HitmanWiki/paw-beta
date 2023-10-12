import get from 'lodash/get'
import unescape from 'lodash/unescape'

export const getName = (generalProfile) => {
    const firstName = get(generalProfile, 'first_name')
    const lastName = get(generalProfile, 'last_name')
    const companyName = get(generalProfile, 'company_name')
    if (companyName) return unescape(companyName)
    if (firstName && lastName) return unescape(`${firstName} ${lastName}`)
    if (firstName || lastName) return unescape(firstName || lastName)
    return 'Anonymous'
}

export const getAddress = (generalProfile) => {
    const country = generalProfile ? .country || ''
    const city = generalProfile ? .city || ''
    return `${country}${country && city ? ', ' : ''}${city}`
}