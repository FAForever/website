exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'account';

	locals.formData = req.body || {};

    var flash = null;

	// Render the view
  locals.username = req.query.username
  locals.token = req.query.token
	res.render('account/activate', {flash: flash});

};
