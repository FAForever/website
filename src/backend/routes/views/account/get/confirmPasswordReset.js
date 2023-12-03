exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}


    // Render the view
    locals.username = req.query.username
    locals.token = req.query.token

    if (!locals.username || !locals.token) {
      const flash = {
        class: 'alert-danger',
        messages: [{ msg: 'Invalid reset request.' }],
        type: 'Error!'
      };

      return res.redirect('/account/requestPasswordReset');
    }

    else {
      const flash = null;
      res.render('account/confirmPasswordReset', { flash })
    }
}
