exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'register';

	locals.formData = req.body || {};

    var flash = null;

    if (req.originalUrl == '/account_activated') {
        flash = {};

        flash.class = 'alert-success';
        flash.messages = [{msg: 'You have activated your account successfully! Please try to login with the new account.'}];
        flash.type = 'Success!';
	}

	// Render the view
	res.render('account/register', {flash: flash});

};
