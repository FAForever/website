const { JavaApiClientFactory } = require('../services/JavaApiClientFactory')

class RequestContainerCompilerPass {
    constructor (appConfig, request = null) {
        this.request = request
        this.appConfig = appConfig
    }

    async process (container) {
        try {
            if (this.request.user) {
                container.get('UserService').setUserFromRequest(this.request)
                container.set('JavaApiClient', JavaApiClientFactory.createInstance(container.get('UserService'), this.appConfig.apiUrl, this.request.user.oAuthPassport, this.appConfig.oauth.strategy))
            }

            return container
        } catch (e) {
            // https://github.com/zazoomauro/node-dependency-injection/issues/208
            container.fafThrownException = e
        }
    }
}

module.exports.RequestContainerCompilerPass = RequestContainerCompilerPass
