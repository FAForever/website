const {Axios} = require("axios");
const refresh = require('passport-oauth2-refresh')
const {AuthFailed} = require('./ApiErrors')
const appConfig = require("../config/app")

const getRefreshToken = (oAuthPassport) => {
    return new Promise((resolve, reject) => {
        refresh.requestNewAccessToken(appConfig.oauth.strategy, oAuthPassport.refreshToken, function(err, accessToken, refreshToken) {
            if (err || !accessToken) {
                return reject(new AuthFailed('Failed to refresh token'))
            }

            return resolve([accessToken, refreshToken])
        })
    })
}

module.exports = (javaApiBaseURL, oAuthPassport) => {
    let tokenRefreshRunning = null
    const client = new Axios({
        baseURL: javaApiBaseURL
    })

    client.interceptors.request.use(
        async config => {
            config.headers = {
                'Authorization': `Bearer ${oAuthPassport.token}`,
            }
            
            return config;
        })
    
    client.interceptors.response.use(async (res) => {
        if (!res.config._refreshTokenRequest && res.config && res.status === 401) {
            res.config._refreshTokenRequest = true;

            if (!tokenRefreshRunning) {
                tokenRefreshRunning = getRefreshToken(oAuthPassport)
            }
            
            const [token, refreshToken]  = await tokenRefreshRunning

            oAuthPassport.token = token
            oAuthPassport.refreshToken = refreshToken

            res.config.headers['Authorization'] =  `Bearer ${token}`

            return client.request(res.config)
        }
        
        if (res.status === 401) {
            new AuthFailed('Token no longer valid and refresh did not help')
        }

        return res
    })
    
    
    
    return client
}
