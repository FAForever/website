exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    // Render the view
    locals.username = req.query.username
    locals.token = req.query.token

    const valid_req = (!locals.token || !locals.username)

    if (valid_req) {
      let flash = {}
      flash.class = 'alert-danger'
      flash.messages = [{ msg: 'Invalid reset link' }]
      flash.type = 'Error!'
      res.redirect('/account/requestPasswordReset')
    } else {
      res.render('account/confirmPasswordReset')
    }
}
