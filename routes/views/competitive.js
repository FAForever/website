var keystone = require('keystone');
var request = require('request');
var challonge_config = require('../challonge_config');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'competitive';
  locals.cSection = 'competitive';
	locals.data = {
	};
	locals.error = false;
	locals.data.upcomingTournaments = [];

	request(challonge_config.getAuth() + '/tournaments.json', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//console.log(body);
			var tournaments = JSON.parse(body);
			for (tournament of tournaments) {
				if (tournament.tournament.state === 'pending') {
					locals.data.upcomingTournaments.push(tournament.tournament);
				}
			}
		} else {
			locals.error = true;
		}
		// Render the view
		view.render('competitive');
	});
};
