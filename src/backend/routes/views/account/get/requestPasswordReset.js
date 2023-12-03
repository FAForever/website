const axios = require('axios')
const appConfig = require('../../../../config/app')

exports = module.exports = async function (req, res) {
    const formData = req.body || {}

    // funky issue: https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
    await new Promise(resolve => process.nextTick(resolve))

    axios.post(appConfig.apiUrl + '/users/buildSteamPasswordResetUrl', {}, { maxRedirects: 0 }).then(response => {
        if (response.status !== 200) {
            throw new Error('java-api error')
        }

        let flash = {}
        if (req.query.flash) {
          flash.class = 'alert-danger'
          flash.messages = [{ msg: req.query.flash }]
          flash.type = 'Error!'
        }

        res.render('account/requestPasswordReset', {
            section: 'account',
            flash: flash,
            steamReset: response.data.steamUrl,
            formData,
            recaptchaSiteKey: appConfig.recaptchaKey
        })
    }).catch(error => {
        console.error(error.toString())
        res.render('account/requestPasswordReset', {
            section: 'account',
            flash: {
                class: 'alert-danger',
                messages: 'issue resetting',
                type: 'Error!'
            },
            formData,
            recaptchaSiteKey: appConfig.recaptchaKey
        })
    })
}
