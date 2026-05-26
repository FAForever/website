const flash = {}
const axios = require('axios')
const error = require('../post/error')

exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    const overallRes = res

    axios
        .post(process.env.API_URL + '/users/resyncAccount', null, {
            headers: {
                Authorization:
                    'Bearer ' +
                    req.requestContainer.get('UserService').getUser()
                        ?.oAuthPassport.token,
            },
            transformResponse: [(r) => r],
            validateStatus: () => true,
            timeout: 10000,
        })
        .then((response) => {
            if (response.status !== 200) {
                error.parseApiErrors(response.data, flash)
            } else {
                // Successfully account resync
                flash.class = 'alert-success'
                flash.messages = [
                    { msg: 'Your account was resynced successfully.' },
                ]
                flash.type = 'Success!'
            }

            overallRes.render('account/confirmResyncAccount', { flash })
        })
        .catch(() => {
            error.parseApiErrors(null, flash)
            overallRes.render('account/confirmResyncAccount', { flash })
        })
}
