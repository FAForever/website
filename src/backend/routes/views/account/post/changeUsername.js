const flash = {}
const axios = require('axios')
const error = require('./error')
const { check, validationResult } = require('express-validator')

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}

    // validate the input
    check('username', 'Username is required').notEmpty()
    check('username', 'Username must be three or more characters').isLength({
        min: 3,
    })

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        // failure
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        res.render('account/changeUsername', { flash })
    } else {
        // pull the form variables off the request body
        const username = req.body.username
        const overallRes = res

        // Run post to reset endpoint
        axios
            .post(
                process.env.API_URL + '/users/changeUsername',
                new URLSearchParams({ newUsername: username }),
                {
                    headers: {
                        Authorization:
                            'Bearer ' +
                            req.requestContainer.get('UserService').getUser()
                                ?.oAuthPassport.token,
                    },
                    transformResponse: [(r) => r],
                    validateStatus: () => true,
                }
            )
            .then((response) => {
                if (response.status !== 200) {
                    error.parseApiErrors(response.data, flash)
                    return overallRes.render('account/changeUsername', {
                        flash,
                    })
                }

                // Successfully changed username
                flash.class = 'alert-success'
                flash.messages = [
                    {
                        msg: 'Your username was changed successfully. Please use the new username to log in!',
                    },
                ]
                flash.type = 'Success!'

                overallRes.render('account/changeUsername', { flash })
            })
            .catch(() => {
                error.parseApiErrors(null, flash)
                return overallRes.render('account/changeUsername', { flash })
            })
    }
}
