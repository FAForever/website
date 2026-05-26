const flash = {}
const axios = require('axios')
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

        res.render('account/activate', { flash })
    } else {
        const token = req.query.token
        const password = req.body.password

        const overallRes = res

        // Run post to reset endpoint
        axios
            .post(
                process.env.API_URL + '/users/activate',
                new URLSearchParams({ password, token }),
                {
                    transformResponse: [(r) => r],
                    validateStatus: () => true,
                }
            )
            .then((response) => {
                if (response.status !== 200) {
                    error.parseApiErrors(response.data, flash)
                    return overallRes.render('account/activate', { flash })
                }

                // Successfully reset password
                flash.class = 'alert-success'
                flash.messages = [
                    { msg: 'Your account was created successfully.' },
                ]
                flash.type = 'Success!'

                overallRes.render('account/activate', { flash })
            })
            .catch(() => {
                error.parseApiErrors(null, flash)
                return overallRes.render('account/activate', { flash })
            })
    }
}
