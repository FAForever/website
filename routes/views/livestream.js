var request = require('request');
    moment = require('moment');
    momentTimezone = require('moment-timezone');

exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'livestream';

	//Moment is used for converting timestamp to January 1st 2016...
    locals.moment = moment;
    locals.momentTimezone = momentTimezone;

    request(
        {
            url: process.env.TWITCH_LIVESTREAM_URL,
            headers: {'Accept': 'application/vnd.twitchtv.v5+jsonp', 'Client-ID': process.env.TWITCH_CLIENT_ID}
        },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                locals.data = JSON.parse(body);
                locals.streamsCount = locals.data._total;
            } else {
                locals.streamsCount = 0;
            }

            // Render the view
            res.render('livestream');
    });

};
