exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    const flash = null

    // Render the view
    res.render('account/register', {
        flash,
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
    })
}
