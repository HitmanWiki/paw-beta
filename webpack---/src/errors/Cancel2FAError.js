export default class Cancel2FAError extends Error {
    constructor() {
        super()
        this.message = 'Cancel 2FA confirmation'
    }
}