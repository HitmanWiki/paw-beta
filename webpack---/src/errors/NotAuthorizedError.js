export default class NotAuthorizedError extends Error {
    constructor() {
        super()
        this.message = 'Not Authorized'
    }
}