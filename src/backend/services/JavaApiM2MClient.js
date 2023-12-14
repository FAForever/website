const { Axios } = require('axios')
const { ClientCredentials } = require('simple-oauth2')
const { AuthFailed } = require('./ApiErrors')

class JavaApiM2MClient {
    static createInstance(clientId, clientSecret, host, javaApiBaseURL) {
        let passport = null
        const axios = new Axios({
            baseURL: javaApiBaseURL,
        })

        axios.interceptors.request.use(async (config) => {
            if (!passport || passport.expired()) {
                passport = await JavaApiM2MClient.getToken(
                    clientId,
                    clientSecret,
                    host
                )
            }
            config.headers.Authorization = `Bearer ${passport.token.access_token}`

            return config
        })

        return axios
    }

    static getToken(clientId, clientSecret, host) {
        const tokenClient = new ClientCredentials({
            client: {
                id: clientId,
                secret: clientSecret,
            },
            auth: {
                tokenHost: host,
                tokenPath: '/oauth2/token',
                revokePath: '/oauth2/revoke',
            },
            options: {
                authorizationMethod: 'body',
            },
        })

        try {
            return tokenClient.getToken({
                scope: '',
            })
        } catch (error) {
            throw new AuthFailed(error.toString())
        }
    }
}

module.exports.JavaApiM2MClient = JavaApiM2MClient
