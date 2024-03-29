const axios = require('axios')
const appConfig = require('../../../../config/app')

exports = module.exports = async function (req, res) {
    const formData = req.body || {}

    // funky issue: https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
    await new Promise((resolve) => process.nextTick(resolve))

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

            res.render('account/requestPasswordReset', {
                section: 'account',
                steamReset: response.data.steamUrl,
                formData,
                recaptchaSiteKey: appConfig.recaptchaKey,
            })
        })
        .catch((error) => {
            console.error(error.toString())
            res.render('account/requestPasswordReset', {
                section: 'account',
                errors: {
                    class: 'alert-danger',
                    messages: error.toString,
                    type: 'Error!',
                },
                formData,
                recaptchaSiteKey: appConfig.recaptchaKey,
            })
        })
}
