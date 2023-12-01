const flash = {}
const request = require('request')
const error = require('../post/error')

exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    const overallRes = res

    request.post({
        url: process.env.API_URL + '/users/resyncAccount',
        headers: { Authorization: 'Bearer ' + req.requestContainer.get('UserService').getUser()?.oAuthPassport.token }
    }, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            error.parseApiErrors(body, flash)
        } else {
        // Successfully account resync
            flash.class = 'alert-success'
            flash.messages = [{ msg: 'Your account was resynced successfully.' }]
            flash.type = 'Success!'
        }

        overallRes.render('account/confirmResyncAccount', { flash })
    }
    )
}
