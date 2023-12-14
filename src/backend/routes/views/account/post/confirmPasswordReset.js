const flash = {}
const request = require('request')
const error = require('./error')
const { check, validationResult } = require('express-validator')

exports = module.exports = function (req, res) {
    const locals = res.locals
    locals.username = req.query.username
    locals.token = req.query.token

    locals.formData = req.body || {}

    // validate the input
    check('password', 'Password is required').notEmpty()
    check('password', 'Password must be six or more characters').isLength({
        min: 6,
    })
    check('password', "Passwords don't match").equals(req.body.password_confirm)

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        res.render('account/confirmPasswordReset', { flash })
    } else {
        const token = req.query.token
        const newPassword = req.body.password

        const overallRes = res

        // Run post to reset endpoint
        request.post(
            {
                url: process.env.API_URL + '/users/performPasswordReset',
                form: { newPassword, token },
            },
            function (err, res, body) {
                if (err || res.statusCode !== 200) {
                    error.parseApiErrors(body, flash)
                    return overallRes.render('account/confirmPasswordReset', {
                        flash,
                    })
                }

                // Successfully reset password
                flash.class = 'alert-success'
                flash.messages = [
                    { msg: 'Your password was changed successfully.' },
                ]
                flash.type = 'Success!'

                overallRes.render('account/confirmPasswordReset', { flash })
            }
        )
    }
}
