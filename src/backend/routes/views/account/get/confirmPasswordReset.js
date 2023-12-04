const { validationResult } = require('express-validator')
exports = module.exports = function (req, res) {
    const locals = res.locals

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const flash = {}
        flash.class = 'alert-danger'
        flash.type = 'Error!'
        flash.messages = []
        errors.array().forEach((e) => {
            flash.messages.push({ msg: e.msg })
        })

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return res.redirect('/account/requestPasswordReset?flash=' + data)
    }

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    // Render the view
    locals.username = req.query.username
    locals.token = req.query.token

    return res.render('account/confirmPasswordReset')
}
