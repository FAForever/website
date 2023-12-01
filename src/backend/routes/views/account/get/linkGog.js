const request = require('request')
const error = require('../post/error')

exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    let flash = {}
    if (req.query.done !== undefined) {
        if (req.query.errors) {
            const errors = JSON.parse(req.query.errors)

            flash.class = 'alert-danger'
            flash.messages = errors.map(error => ({ msg: error.detail }))
            flash.type = 'Error'
        }
    } else {
        flash = null
    }

    const overallRes = res

    request.get({
        url: process.env.API_URL + '/users/buildGogProfileToken',
        headers: { Authorization: 'Bearer ' + req.services.userService.getUser()?.oAuthPassport.token },
        form: {}
    }, function (err, res, body) {
        locals.gogToken = 'unable to obtain token'
        if (err || res.statusCode !== 200) {
            flash = {}
            error.parseApiErrors(body, flash)
            return overallRes.render('account/linkGog', { flash })
        }

        locals.gogToken = JSON.parse(body).gogToken

        // Render the view
        overallRes.render('account/linkGog', { flash })
    })
}
