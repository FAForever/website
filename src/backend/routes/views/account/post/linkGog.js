let flash = {}
const axios = require('axios')
const error = require('./error')
const { check, validationResult } = require('express-validator')

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}

    // validate the input
    check('gog_username', 'Username is required').notEmpty()
    check('gog_username', 'Username must be at least 3 characters').isLength({
        min: 3,
    })
    check('gog_username', 'Username must be at most 100 characters').isLength({
        max: 100,
    })

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        // failure
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        res.render('account/linkGog', { flash })
    } else {
        const gogUsername = req.body.gog_username // this is obtained from the form field in the mixin, not the pug file of this page!

        const overallRes = res
        const authHeader =
            'Bearer ' +
            req.requestContainer.get('UserService').getUser()?.oAuthPassport
                .token

        axios
            .post(
                process.env.API_URL + '/users/linkToGog',
                new URLSearchParams({ gogUsername }),
                {
                    headers: { Authorization: authHeader },
                    transformResponse: [(r) => r],
                    validateStatus: () => true,
                }
            )
            .then((response) => {
                if (response.status === 200) {
                    flash.class = 'alert-success'
                    flash.messages = [
                        { msg: 'Your accounts were linked successfully.' },
                    ]
                    flash.type = 'Success!'

                    locals.gogToken = '-'
                    return overallRes.render('account/linkGog', { flash })
                }

                error.parseApiErrors(response.data, flash)

                // We need the gog token on the error page as well,
                // this code literally does the same as linkGog.js, but due to the architectural structure of this application
                // it's not possible to extract it into a separate function while saving any code
                return axios
                    .get(process.env.API_URL + '/users/buildGogProfileToken', {
                        headers: { Authorization: authHeader },
                        transformResponse: [(r) => r],
                        validateStatus: () => true,
                    })
                    .then((tokenResponse) => {
                        locals.gogToken = 'unable to obtain token'
                        if (tokenResponse.status !== 200) {
                            flash = {}
                            error.parseApiErrors(tokenResponse.data, flash)
                            return overallRes.render('account/linkGog', {
                                flash,
                            })
                        }

                        locals.gogToken = JSON.parse(
                            tokenResponse.data
                        ).gogToken

                        return overallRes.render('account/linkGog', { flash })
                    })
                    .catch(() => {
                        locals.gogToken = 'unable to obtain token'
                        flash = {}
                        error.parseApiErrors(null, flash)
                        return overallRes.render('account/linkGog', { flash })
                    })
            })
            .catch(() => {
                error.parseApiErrors(null, flash)
                return overallRes.render('account/linkGog', { flash })
            })
    }
}
