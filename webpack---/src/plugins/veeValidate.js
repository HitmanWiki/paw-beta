import {
    Validator,
    install as VeeValidate
} from 'vee-validate/dist/vee-validate.minimal.esm.js'
import {
    required,
    between,
    min,
    max,
    min_value,
    max_value,
    email,
    is,
    numeric,
    length,
    integer,
    url
} from 'vee-validate/dist/rules.esm.js'
import veeEn from 'vee-validate/dist/locale/en'

Validator.localize('en', veeEn)

const defaultRules = {
    required,
    between,
    min,
    max,
    min_value,
    max_value,
    email,
    is,
    numeric,
    length,
    integer,
    url
}

export const password = {
    getMessage: field => 'Password must contain letters in different registers and numbers',
    validate: (value) => {
        return !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)
    },
}

export const requiredIf = {
    getMessage: field => `The ${field} field is required`,
    validate: (value, args) => {
        let [withFunc, ...prop] = args
        let valid = true
        if (withFunc(...prop)) {
            valid = !!(Array.isArray(value) ? value.filter(Boolean).length : value)
        }
        return {
            valid,
            data: {
                required: true
            }
        }
    },
    options: {
        computesRequired: true
    },
}

export const requiredField = {
    getMessage: field => 'Required field',
    validate: (value) => !!value

}

export const requiredTrue = {
    getMessage: field => `The ${field} field is required`,
    validate: (value) => !!value
}

export const ethAddress = {
    getMessage: field => 'The ETH address is not correct',
    validate: (address) => (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address)),
}

export const tronAddress = {
    getMessage: field => 'The TRON address is not correct',
    validate: (address) => (address || '').length === 34,
}

export const numericInputRequired = {
    getMessage: field => `The ${field} field is required`,
    validate: (value) => !!value && !!+value,
}

export const numericInputRequiredOrZero = {
    getMessage: field => `The ${field} field is required`,
    validate: (value) => (!!value && !!+value) || value === 0,
}

export const withoutNumbers = {
    getMessage: field => `The ${field} mustn't has any numbers`,
    validate: (value) => !!value && (/^\D*$/).test(value),
}

function install(Vue) {
    const validators = {
        ...defaultRules,
        password,
        requiredIf,
        requiredField,
        requiredTrue,
        ethAddress,
        tronAddress,
        numericInputRequired,
        numericInputRequiredOrZero,
        withoutNumbers,
    }
    for (const [name, validatorData] of Object.entries(validators)) {
        const {
            options,
            ...validator
        } = validatorData
        Validator.extend(name, validator, options)
    }
    Vue.use(VeeValidate)
}

export default {
    install
}