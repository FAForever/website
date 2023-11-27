class UserService {
    constructor (userRepository, request) {
        this.userRepository = userRepository
        this.request = request
        this.user = request.user
    }

    async refreshUser () {
        const oAuthPassport = this.user.oAuthPassport

        this.user = await this.userRepository.fetchUser(oAuthPassport)
        this.request.user = this.user
        this.request.session.user = this.user

        return this.user
    }
}

module.exports = UserService
