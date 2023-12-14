const appConfig = require('../../config/app')
const passport = require('passport')
const express = require('../../ExpressApp')
const router = express.Router()

router.get('/login', passport.authenticate(appConfig.oauth.strategy))

router.get(
    '/' + appConfig.oauth.callback,
    (req, res, next) => {
        res.locals.returnTo = req.session.returnTo

        return next()
    },
    passport.authenticate(appConfig.oauth.strategy, {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        res.redirect(res.locals.returnTo || '/')
    }
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
