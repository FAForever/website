class UserService {
    constructor() {
        this.user = null
        this.session = null
        this.userRepository = null
    }

    setUserFromRequest(request) {
        this.user = request.user
        this.session = request.session
    }

    setUserRepository(userRepository) {
        this.userRepository = userRepository
    }

    isAuthenticated() {
        return !!this.user
    }

    getUser() {
        return this.session?.passport?.user
    }

    updatePassport(oAuthPassport) {
        this.user.oAuthPassport = oAuthPassport
        this.session.passport.user.oAuthPassport = oAuthPassport
    }

    async refreshUser() {
        const oAuthPassport = this.user.oAuthPassport

        this.user = await this.userRepository.fetchUser(oAuthPassport)
        this.session.passport.user = this.user

        await new Promise((resolve) => this.session.save(resolve))

        return this.user
    }
}

module.exports.UserService = UserService
