class LoggedInUserService {
    constructor (userRepository, request) {
        this.request = request

        if (typeof this.request.user !== "object") {
            throw new Error("request.user not an object");
        }
    }
    
    getUser() {
        return this.request.user
    }
}

module.exports = LoggedInUserService
