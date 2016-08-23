exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'calendar';

	locals.calendar = process.env.GOOGLE_CALENDAR_API_KEY;

	// Render the view
	res.render('calendar');

};
