var request = require('request');
var challonge_config = require('../challonge_config');

exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'competitive';
	locals.cSection = 'tournaments';
	locals.data = {
	};
	locals.error = false;
	locals.data.upcomingTournaments = [];
	locals.data.runningTournaments = [];

	request(challonge_config.getAuth() + '/tournaments.json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var tournaments = JSON.parse(body);
			for (tournament of tournaments) {
				if (tournament.tournament.state === 'pending') {
					var startDate = new Date(tournament.tournament.start_at);
					tournament.tournament.start_at = startDate.toUTCString();
					locals.data.upcomingTournaments.push(tournament.tournament);
				} else if (tournament.tournament.state === 'underway' || tournament.tournament.state === 'in_progress') {
					locals.data.runningTournaments.push(tournament.tournament);
				}
			}
		} else {
			locals.error = true;
		}
		// Render the view
		res.render('tournaments');
	});
};
