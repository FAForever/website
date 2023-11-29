const { Axios } = require('axios')
const refresh = require('passport-oauth2-refresh')
const { AuthFailed } = require('./ApiErrors')
const appConfig = require('../config/app')

const getRefreshToken = (oAuthPassport) => {
    return new Promise((resolve, reject) => {
        refresh.requestNewAccessToken(appConfig.oauth.strategy, oAuthPassport.refreshToken, function (err, accessToken, refreshToken) {
            if (err || !accessToken || !refreshToken) {
                return reject(new AuthFailed('Failed to refresh token'))
            }

            return resolve([accessToken, refreshToken])
        })
    })
}

module.exports.JavaApiClientFactory = (javaApiBaseURL, oAuthPassport) => {
    if (typeof oAuthPassport !== "object") {
        throw new Error("oAuthPassport not an object");
    }

    if (typeof oAuthPassport.refreshToken !== "string") {
        throw new Error("oAuthPassport.refreshToken not a string")
    }

    if (typeof oAuthPassport.token !== "string") {
        throw new Error("oAuthPassport.token not a string")
    }
    
    let tokenRefreshRunning = null
    const client = new Axios({
        baseURL: javaApiBaseURL
    })

    client.interceptors.request.use(
        async config => {
            config.headers = {
                Authorization: `Bearer ${oAuthPassport.token}`
            }

            return config
        })

    client.interceptors.response.use((res) => {
        if (!res.config._refreshTokenRequest && res.config && res.status === 401) {
            res.config._refreshTokenRequest = true

            if (!tokenRefreshRunning) {
                tokenRefreshRunning = getRefreshToken(oAuthPassport)
            }

            return tokenRefreshRunning.then(([token, refreshToken]) => {
                oAuthPassport.token = token
                oAuthPassport.refreshToken = refreshToken

                return client.request(res.config)
            })
        }

        if (res.status === 401) {
            throw new AuthFailed('Token no longer valid and refresh did not help')
        }

        return res
    })

    return client
}
