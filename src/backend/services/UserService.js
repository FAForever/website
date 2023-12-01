class UserService {
    constructor () {
        this.user = null
        this.session = null
    }

    setUserFromRequest (request) {
        this.user = request.user
        this.session = request.session.passport
    }

    isAuthenticated () {
        return !!this.user
    }

    getUser () {
        return this.user
    }

    updatePassport (oAuthPassport) {
        this.user.oAuthPassport = oAuthPassport
        this.session.user.oAuthPassport = oAuthPassport
    }
}

module.exports.UserService = UserService
