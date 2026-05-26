const flash = {}
const axios = require('axios')
const error = require('./error')
const { check, validationResult } = require('express-validator')

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}

    // validate the input
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

        res.render('account/changeEmail', { flash })
    } else {
        // pull the form variables off the request body

        const email = req.body.email
        const password = req.body.password

        const overallRes = res

        axios
            .post(
                `${process.env.API_URL}/users/changeEmail`,
                new URLSearchParams({
                    newEmail: email,
                    currentPassword: password,
                }),
                {
                    headers: {
                        Authorization: `Bearer ${
                            req.requestContainer.get('UserService').getUser()
                                ?.oAuthPassport.token
                        }`,
                    },
                    transformResponse: [(r) => r],
                    validateStatus: () => true,
                }
            )
            .then((response) => {
                if (response.status !== 200) {
                    error.parseApiErrors(response.data, flash)
                    return overallRes.render('account/changeEmail', { flash })
                }

                // Successfully changed email
                flash.class = 'alert-success'
                flash.messages = [{ msg: 'Your email was set successfully.' }]
                flash.type = 'Success!'

                overallRes.render('account/changeEmail', { flash })
            })
            .catch(() => {
                error.parseApiErrors(null, flash)
                return overallRes.render('account/changeEmail', { flash })
            })
    }
}
