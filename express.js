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
app.get('/competitive/tournaments', function(req, res) { res.render('tournaments'); });
app.get('/competitive/leaderboards', function(req, res) { res.render('leaderboards'); });

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('errors/500', {
			message: err.message,
			error: err
		});
	});
}

app.listen(app.get('port'), function () {
	console.log('Express listening on port ' + app.get('port'));
});