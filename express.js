// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');

var app = express();
app.use(express.static('public'));

app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', process.env.PORT);

app.get('/', function(req, res) { res.render('index'); });
app.get('/contribution', function(req, res) { res.render('contribution'); });

app.get('/competitive/tournaments', function(req, res) {

	var challonge_config = require('./routes/challonge_config.js');
	var request = require('request');

	res.locals.section = 'competitive';
	res.locals.cSection = 'tournaments';
	res.locals.cNavLinks = [
		{ label: 'Tournaments',		key: 'tournaments',		href: '/competitive/tournaments' },
		{ label: 'Leaderboards',		key: 'leaderboards',		href: '/competitive/leaderboards' }
	];

	request(challonge_config.getAuth() + '/tournaments.json', function (error, response, body) {
		var data = {};
		var error = false;
		data.upcomingTournaments = [];
		data.runningTournaments = [];

		if (!error && response.statusCode == 200) {
			var tournaments = JSON.parse(body);
			for (tournament of tournaments) {
				if (tournament.tournament.state === 'pending') {
					var startDate = new Date(tournament.tournament.start_at);
					tournament.tournament.start_at = startDate.toUTCString();
					data.upcomingTournaments.push(tournament.tournament);
				} else if (tournament.tournament.state === 'underway' || tournament.tournament.state === 'in_progress') {
					data.runningTournaments.push(tournament.tournament);
				}
			}
		} else {
			error = true;
		}
		// Render the view
		res.render('tournaments', {error: error, data: data});
	});

});

app.get('/competitive/leaderboards', function(req, res) {

	res.locals.cNavLinks = [
		{ label: 'Tournaments',		key: 'tournaments',		href: '/competitive/tournaments' },
		{ label: 'Leaderboards',		key: 'leaderboards',		href: '/competitive/leaderboards' }
	];

	res.locals.section = 'competitive';
	res.locals.cSection = 'leaderboards';

	res.render('leaderboards');
});



app.listen(app.get('port'), function () {
	console.log('Express listening on port ' + app.get('port'));
});