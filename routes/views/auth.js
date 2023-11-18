const appConfig = require('../../config/app')
const passport = require('passport');
const OidcStrategy = require('passport-openidconnect');
const express = require("express");
const axios = require("axios");
const router = express.Router();

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

passport.use('faforever', new OidcStrategy({
        issuer: appConfig.oauth.url + '/',
        tokenURL: appConfig.oauth.url + '/oauth2/token',
        authorizationURL: appConfig.oauth.publicUrl + '/oauth2/auth',
        userInfoURL: appConfig.oauth.url + '/userinfo?schema=openid',
        clientID: appConfig.oauth.clientId,
        clientSecret: appConfig.oauth.clientSecret,
        callbackURL: `${appConfig.host}/${appConfig.oauth.callback}`,
        scope: ['openid', 'public_profile', 'write_account_data']
    }, function (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verified) {

        axios.get(
            appConfig.apiUrl + '/me',
            {
                headers: {'Authorization': `Bearer ${accessToken}`}
            }).then((res) => {
            const user = res.data
            user.token = accessToken
            user.data.attributes.token = accessToken;
            user.data.id = user.data.attributes.userId;

            return verified(null, user);
        }).catch(e => {
            console.error('[Error] views/auth.js::passport::verify failed with "' + e.toString() + '"');

            return verified(null, null);
        });
    }
));

router.get('/login', passport.authenticate('faforever'));

router.get(
    '/' + appConfig.oauth.callback,
    passport.authenticate('faforever', {failureRedirect: '/login', failureFlash: true}),
    (req, res) => res.redirect('/')
)

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    })
})

module.exports = router
