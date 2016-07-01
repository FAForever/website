// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');

var app = express();
app.use(express.static('public'));

app.set('views', 'templates/views');
app.set('view engine', 'pug');

app.get('/', function(req, res) { res.render('index'); });
app.get('/contribution', function(req, res) { res.render('contribution'); });
app.get('/competitive/tournaments', function(req, res) { res.render('tournaments'); });
app.get('/competitive/leaderboards', function(req, res) { res.render('leaderboards'); });

app.use(function(err, req, res, next){
	res.render('errors/500', { error: err });
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});