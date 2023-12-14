const { Axios } = require('axios')
const refresh = require('passport-oauth2-refresh')
const { AuthFailed } = require('./ApiErrors')

const getRefreshToken = (strategy, oAuthPassport) => {
    return new Promise((resolve, reject) => {
        refresh.requestNewAccessToken(
            strategy,
            oAuthPassport.refreshToken,
            function (err, accessToken, refreshToken) {
                if (err || !accessToken || !refreshToken) {
                    return reject(
                        new AuthFailed('Failed to refresh token' + err)
                    )
                }

                return resolve([accessToken, refreshToken])
            }
        )
    })
}

class JavaApiClientFactory {
    static createInstance(
        userService,
        javaApiBaseURL,
        oAuthPassport,
        strategy
    ) {
        if (typeof oAuthPassport !== 'object') {
            throw new Error('oAuthPassport not an object')
        }

        if (typeof oAuthPassport.refreshToken !== 'string') {
            throw new Error('oAuthPassport.refreshToken not a string')
        }

        if (typeof oAuthPassport.token !== 'string') {
            throw new Error('oAuthPassport.token not a string')
        }

        let tokenRefreshRunning = null
        const client = new Axios({
            baseURL: javaApiBaseURL,
        })

        client.interceptors.request.use(async (config) => {
            config.headers.Authorization = `Bearer ${oAuthPassport.token}`

            return config
        })

        client.interceptors.response.use((res) => {
            if (
                !res.config._refreshTokenRequest &&
                res.config &&
                res.status === 401
            ) {
                res.config._refreshTokenRequest = true

                if (!tokenRefreshRunning) {
                    tokenRefreshRunning = getRefreshToken(
                        strategy,
                        oAuthPassport
                    )
                }

                return tokenRefreshRunning.then(([token, refreshToken]) => {
                    oAuthPassport.token = token
                    oAuthPassport.refreshToken = refreshToken

                    userService.updatePassport(oAuthPassport)

                    return client.request(res.config)
                })
            }

            if (res.status === 401) {
                throw new AuthFailed(
                    'Token no longer valid and refresh did not help'
                )
            }

            return res
        })

        return client
    }
}

module.exports.JavaApiClientFactory = JavaApiClientFactory
