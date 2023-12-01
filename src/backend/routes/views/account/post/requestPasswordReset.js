const flash = {}
const request = require('request')
const error = require('./error')
const { check, validationResult } = require('express-validator')

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}

    // validate the input
    check('usernameOrEmail', 'Username or email is required').notEmpty()

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        res.render('account/requestPasswordReset', { flash })
    } else {
        const identifier = req.body.usernameOrEmail
        const recaptchaResponse = req.body['g-recaptcha-response']

        const overallRes = res

        // Run post to reset endpoint
        request.post({
            url: process.env.API_URL + '/users/requestPasswordReset',
            form: { identifier, recaptchaResponse }
        }, function (err, res, body) {
            if (err || res.statusCode !== 200) {
                error.parseApiErrors(body, flash)
                return overallRes.render('account/requestPasswordReset', {
                    flash,
                    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
                })
            }

            // Successfully reset password
            flash.class = 'alert-success'
            flash.messages = [{ msg: 'Your password is in the process of being reset, please reset your password by clicking on the link provided in an email.' }]
            flash.type = 'Success!'

            overallRes.render('account/requestPasswordReset', {
                flash,
                recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
            })
        })
    }
}
