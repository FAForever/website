const passport = require('passport')
const OidcStrategy = require('passport-openidconnect')
const refresh = require('passport-oauth2-refresh')
const { JavaApiClientFactory } = require('../services/JavaApiClientFactory')
const { UserRepository } = require('../services/UserRepository')
const { UserService } = require('../services/UserService')

module.exports.bootPassport = (expressApp, appConfig) => {
    expressApp.use(passport.initialize())
    expressApp.use(passport.session())

    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    const authStrategy = new OidcStrategy(
        {
            passReqToCallback: true,
            issuer: appConfig.oauth.url + '/',
            tokenURL: appConfig.oauth.url + '/oauth2/token',
            authorizationURL: appConfig.oauth.publicUrl + '/oauth2/auth',
            userInfoURL: appConfig.oauth.url + '/userinfo?schema=openid',
            clientID: appConfig.oauth.clientId,
            clientSecret: appConfig.oauth.clientSecret,
            callbackURL: `${appConfig.host}/${appConfig.oauth.callback}`,
            scope: [
                'openid',
                'offline',
                'public_profile',
                'write_account_data',
            ],
        },
        async function (
            req,
            iss,
            sub,
            profile,
            jwtClaims,
            token,
            refreshToken,
            params,
            verified
        ) {
            const oAuthPassport = {
                token,
                refreshToken,
            }

            const apiClient = JavaApiClientFactory.createInstance(
                new UserService(),
                appConfig.apiUrl,
                oAuthPassport
            )
            const userRepository = new UserRepository(apiClient)

            userRepository
                .fetchUser(oAuthPassport)
                .then((user) => {
                    verified(null, user)
                })
                .catch((e) => {
                    console.error(
                        '[Error] oAuth verify failed with "' +
                            e.toString() +
                            '"'
                    )
                    verified(null, null)
                })
        }
    )

    passport.use(appConfig.oauth.strategy, authStrategy)
    refresh.use(appConfig.oauth.strategy, authStrategy)
}
