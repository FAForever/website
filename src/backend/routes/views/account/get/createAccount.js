exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    if (req.query.token) {
        locals.tokenURL =
            process.env.API_URL + '/users/activate?token=' + req.query.token
    } else {
        const flash = {}
        flash.type = 'Error!'
        flash.class = 'alert-danger'
        flash.messages = [{ msg: 'Invalid or missing account token' }]

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return res.redirect('/?flash=' + data)
    }

    // Render the view
    res.render('account/create')
}
