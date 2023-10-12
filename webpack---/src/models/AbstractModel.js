import Joi from 'joi'

class AbstractModel {
    constructor(props, scheme) {
        const schemes = []
        /**
         * Проходит по прототипам класса для поиска схем класса
         * @param  {Function} constructorFunc ссылка на функцию конструктор класса
         */
        const getScheme = obj => {
            if (obj.propTypes) {
                schemes.push(obj.propTypes)
            }
            const parent = Object.getPrototypeOf(obj)
            if (parent) {
                getScheme(parent)
            }
        }
        if (scheme) {
            schemes.push(scheme)
        } else {
            getScheme(this.constructor)
        }
        const {
            error,
            value
        } = Joi.object(
            Object.assign({}, ...schemes.reverse())).options({
            stripUnknown: true
        }).validate(props || {})
        if (error) {
            throw new Error(error)
        }
        Object.assign(this, value)
    }
}

export default AbstractModel