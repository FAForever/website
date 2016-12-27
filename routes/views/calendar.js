var locale = require("accept-language-parser");
var challonge_config = require('../challonge_config');
var request = require('request');

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

    request(challonge_config.getAuth() + '/tournaments.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var events = [];
            var tournaments = JSON.parse(body);

            for (tournament of tournaments) {
				if (tournament.tournament.start_at || tournament.tournament.started_at) {
                    events.push({
                        id: tournament.tournament.id,
                        title: tournament.tournament.name,
                        start: tournament.tournament.start_at || tournament.tournament.started_at, // try timed. will fall back to all-day
                        end: tournament.tournament.completed_at, // same
                        url: tournament.tournament.full_challonge_url,
                        description: tournament.tournament.tournament_type
                    });
                    locals.tournaments = events;
				}
            }
        } else {
            locals.error = true;
        }

        // Render the view
        res.render('calendar');
    });

};
