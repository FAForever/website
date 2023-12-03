exports = module.exports = function (req, res) {
    const locals = res.locals

    const overallRes = res

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    // Render the view
    locals.username = req.query.username
    locals.token = req.query.token

    // Ensure token and username are present
    const validateParamPresence = (token, username) => {
        if (!token || !username) {
            return 'Invalid request'
        } else {
            return null
        }
    }

    const errorMsg = validateParamPresence(req.query.username, req.query.token)

    if (errorMsg) {
        const flash = {}
        flash.class = 'alert-danger'
        flash.messages = [{ msg: errorMsg }]
        flash.type = 'Error!'

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return overallRes.redirect('/account/requestPasswordReset?flash=' + data)
    } else {
        res.render('account/confirmPasswordReset')
    }
}
