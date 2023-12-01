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
        } else {
            flash.class = 'alert-success'
            flash.messages = [{ msg: 'Your steam account has successfully been linked.' }]
            flash.type = 'Success'
        }
    } else {
        flash = null
    }

    // locals.steam = process.env.API_URL + '/users/linkToSteam';
    locals.steamConnect = req.protocol + '://' + req.get('host') + '/account/connect'

    // Render the view
    res.render('account/linkSteam', { flash })
}
