var locale = require("accept-language-parser");

exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'calendar';

	locals.calendar = process.env.GOOGLE_CALENDAR_API_KEY;

	var languages = locale.parse(req.headers["accept-language"]);

	if (languages.length != 0) {
		locals.locale = languages[0].code;
	} else {
		locals.locale = 'en';
	}

	// Render the view
	res.render('calendar');

};
