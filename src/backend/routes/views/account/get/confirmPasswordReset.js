exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    // Render the view
    locals.username = req.query.username
    locals.token = req.query.token

    // Likely too verbose - but can be used as a catch-all for further validations
    const valid_params = (token, username) => {
        if (!token || !username) {
          return false
        } else {
          return true
        }
    }

    valid_params
        ? res.render('account/confirmPasswordReset')
        : () => {
            res.redirect('/account/requestPasswordReset')
          }
}
