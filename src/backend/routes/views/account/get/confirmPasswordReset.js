const axios = require('axios')
const appConfig = require('../../../../config/app')
const { validationResult } = require('express-validator')
exports = module.exports = function (req, res) {
    const errors = validationResult(req)

    // A render/redirect ignores this if not async and renders the confirm
    // Theres probably a better way to do this
    if (!errors.isEmpty()) {
        return renderRequestPasswordReset(req, res, errors)
    }

    res.render('account/confirmPasswordReset', {
        section: 'account',
        formData: req.body || {},
        username: req.query.username,
        token: req.query.token,
    })
}

const renderRequestPasswordReset = async (req, res, errors) => {
    axios
        .post(
            appConfig.apiUrl + '/users/buildSteamPasswordResetUrl',
            {},
            { maxRedirects: 0 }
        )
        .then((response) => {
            if (response.status !== 200) {
                throw new Error('java-api error')
            }

            errors.errors[errors.errors.length - 1].msg +=
                '. You may request a new link here'

            return res.render('account/requestPasswordReset', {
                section: 'account',
                errors: {
                    class: 'alert-danger',
                    messages: errors,
                    type: 'Error!',
                },
                steamReset: response.data.steamUrl,
                formData: {},
                recaptchaSiteKey: appConfig.recaptchaKey,
            })
        })
        .catch((error) => {
            console.error(error.toString())
            return res.render('account/requestPasswordReset', {
                section: 'account',
                errors: {
                    class: 'alert-danger',
                    messages: error.toString(),
                    type: 'Error!',
                },
                formData: {},
                recaptchaSiteKey: appConfig.recaptchaKey,
            })
        })
}
