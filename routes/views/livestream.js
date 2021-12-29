var request = require('request');
    moment = require('moment');
    momentTimezone = require('moment-timezone');

exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'livestream';
  res.render('livestream');
};
