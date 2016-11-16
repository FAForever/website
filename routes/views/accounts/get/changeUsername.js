exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'changeUsername';

	locals.formData = req.body || {};

	// Render the view
	res.render('account/changeUsername');

};
