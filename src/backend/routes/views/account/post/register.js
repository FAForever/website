const flash = {}
const request = require('request')
const { check, validationResult } = require('express-validator')
require('dotenv').config()

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}
    // validate the input
    check('username', 'Username is required').notEmpty()
    check('username', 'Username must be three or more characters').isLength({
        min: 3,
    })
    check('email', 'Email is required').notEmpty()
    check('email', 'Email does not appear to be valid').isEmail()

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        // failure
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        res.render('account/register', { flash })
    } else {
        // pull the form variables off the request body
        const username = req.body.username
        const email = req.body.email
        const recaptchaResponse = req.body['g-recaptcha-response']

        const overallRes = res

        // Run post to register endpoint
        request.post(
            {
                url: process.env.API_URL + '/users/register',
                form: { username, email, recaptchaResponse },
            },
            function (err, res, body) {
                let resp
                const errorMessages = []

                if (err || res.statusCode !== 200) {
                    try {
                        resp = JSON.parse(body)
                    } catch (e) {
                        errorMessages.push({
                            msg: 'Invalid registration sign up. Please try again later.',
                        })
                        flash.class = 'alert-danger'
                        flash.messages = errorMessages
                        flash.type = 'Error!'

                        return overallRes.render('account/register', {
                            flash,
                            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
                        })
                    }

                    // Failed registering user
                    for (let i = 0; i < resp.errors.length; i++) {
                        const error = resp.errors[i]

                        errorMessages.push({ msg: error.detail })
                    }

                    flash.class = 'alert-danger'
                    flash.messages = errorMessages
                    flash.type = 'Error!'

                    return overallRes.render('account/register', {
                        flash,
                        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
                    })
                }

                // Successfully registered user
                flash.class = 'alert-success'
                flash.messages = [
                    {
                        msg: 'Please check your email to verify your registration. Then you will be ready to log in!',
                    },
                ]
                flash.type = 'Success!'

                overallRes.render('account/register', { flash })
            }
        )
    }
}
