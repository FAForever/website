const {Axios} = require("axios");
const refresh = require('passport-oauth2-refresh')
const {AuthFailed} = require('./ApiErrors')
const appConfig = require("../config/app")

const getRefreshToken = (user) => {
    return new Promise((resolve, reject) => {
        refresh.requestNewAccessToken(appConfig.oauth.strategy, user.refreshToken, function(err, accessToken, refreshToken) {
            if (err || !accessToken) {
                return reject(new AuthFailed('Failed to refresh token'))
            }

            return resolve([accessToken, refreshToken])
        })
    })
}

module.exports = (javaApiBaseURL, user) => {
    let tokenRefreshRunning = null
    const client = new Axios({
        baseURL: javaApiBaseURL
    })

    client.interceptors.request.use(
        async config => {
            config.headers = {
                'Authorization': `Bearer ${user.token}`,
            }
            
            return config;
        })
    
    client.interceptors.response.use(async (res) => {
        if (!res.config._refreshTokenRequest && res.config && res.status === 401) {
            res.config._refreshTokenRequest = true;

            if (!tokenRefreshRunning) {
                tokenRefreshRunning = getRefreshToken(user)
            }
            
            const [token, refreshToken]  = await tokenRefreshRunning

            user.token = token
            user.refreshToken = refreshToken

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
