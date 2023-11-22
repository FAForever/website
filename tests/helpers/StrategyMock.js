const passport = require('passport')
const util = require('util')

function StrategyMock(options) {
    this.name = 'mock'
    this.passAuthentication = options.passAuthentication ?? true
    this.user = options.user || {
        token: 'test-token',
        data: {
            id: 1,
            attributes: {
                token: 'test-token'
            }
        }
    }
}

util.inherits(StrategyMock, passport.Strategy)

StrategyMock.prototype.authenticate = function authenticate(req) {
    if (this.passAuthentication) {
        return this.success(this.user)
    }

    return this.fail('Unauthorized')
}

module.exports = StrategyMock
