const passport = require('passport')
const util = require('util')

function StrategyMock (options) {
    this.name = 'mock'
    this.passAuthentication = options.passAuthentication ?? true
    this.user = options.user || {
        oAuthPassport: {
            token: 'test-token',
            refreshToken: 'test-refresh-token'
        },
        id: -1,
        name: 'minion',
        email: 'banana@example.org',
        clan: null
    }
}

util.inherits(StrategyMock, passport.Strategy)

StrategyMock.prototype.authenticate = function authenticate (req) {
    if (this.passAuthentication) {
        return this.success(this.user)
    }

    return this.fail('Unauthorized')
}

module.exports = StrategyMock
