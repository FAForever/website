exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'resetPassword';

	locals.formData = req.body || {};

    var flash = null;

    if (req.originalUrl == '/password_resetted') {
        flash = {};

        flash.class = 'alert-success';
        flash.messages = [{msg: 'You have successfully reset your password! Please try to login with the new password.'}];
        flash.type = 'Success!';
    }

	// Render the view
	res.render('account/resetPassword', {flash: flash});

};
