// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var express = require('express');

var middleware = require('./routes/middleware');

var app = express();

//Execute middleware before each request...
app.use('/', middleware);

//Set static public directory path
app.use(express.static('public'));

//Initialize values for default configs
app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', process.env.PORT);

//Variable to hold routing path
var routes = './routes/views/';

//Define routes
app.get('/', require(routes + 'index'));
app.get('/contribution', require(routes + 'contribution'));
app.get('/competitive/tournaments', require(routes + 'tournaments'));
app.get('/competitive/leaderboards', require(routes + 'leaderboards'));

//Start and listen on port
app.listen(app.get('port'), function () {
	console.log('Express listening on port ' + app.get('port'));
});