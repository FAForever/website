// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require("dotenv-safe").config();

var express = require('express');

var middleware = require('./routes/middleware');

var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var passport = require('passport'),
	OAuthStrategy = require('passport-oauth').OAuth2Strategy;

var app = express();

//Define environment variables with default values
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.WP_URL = process.env.WP_URL || 'http://direct.faforever.com/wp-json';
process.env.CHALLONGE_USERNAME = process.env.CHALLONGE_USERNAME || 'joe';
process.env.CHALLONGE_APIKEY = process.env.CHALLONGE_APIKEY || '12345';
process.env.PORT = process.env.PORT || '4000';
process.env.GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY || '12345';
process.env.API_URL = process.env.API_URL || 'https://api.test.faforever.com';
process.env.OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || '12345';
process.env.OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '12345';
process.env.HOST = process.env.HOST || 'http://localhost';
process.env.SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || '12345';
process.env.TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '12345';
process.env.TWITCH_LIVESTREAM_URL = process.env.TWITCH_LIVESTREAM_URL || 'https://api.twitch.tv/kraken/streams/?game=Supreme%20Commander:%20Forged%20Alliance';

//Execute middleware before each request...
app.use(middleware.initLocals);
app.use(middleware.getLatestClientRelease);
app.use(middleware.clientChecks);

//Set static public directory path
app.use(express.static('public', {
    immutable: true,
    maxAge: 4 * 60 * 60 * 1000 // 4 hours
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
    customValidators: {
        isEqual: function(value1, value2) {
            return value1 === value2;
        }
    }
}));
app.use(require('express-session')({
	secret: process.env.SESSION_SECRET_KEY,
	resave: false,
	saveUninitialized: false
}));

//Authentication on pages
app.use(passport.initialize());
app.use(passport.session());
app.use(middleware.username);

//Initialize values for default configs
app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', process.env.PORT);

//Variable to hold routing path
var routes = './routes/views/';

//Define routes
app.get('/', require(routes + 'index'));

function loggedIn(req, res, next) {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	req.session.referral = fullUrl;

	if (req.isAuthenticated()) {
		res.locals.username = req.user.data.attributes.login;
		next();
	} else {
		res.redirect('/login');
	}
}

//Account routes
app.get('/account/register', require(routes + 'accounts/get/register'));
app.post('/account/register', require(routes + 'accounts/post/register'));

app.get('/account/link', loggedIn, require(routes + 'accounts/get/linkSteam'));

app.get('/account/connect', loggedIn, require(routes + 'accounts/get/connectSteam'));

app.get('/account/password/reset', require(routes + 'accounts/get/resetPassword'));
app.post('/account/password/reset', require(routes + 'accounts/post/resetPassword'));

app.get('/account/password/change', loggedIn, require(routes + 'accounts/get/changePassword'));
app.post('/account/password/change', loggedIn, require(routes + 'accounts/post/changePassword'));

app.get('/account/username/change', loggedIn, require(routes + 'accounts/get/changeUsername'));
app.post('/account/username/change', loggedIn, require(routes + 'accounts/post/changeUsername'));

app.get('/account/email/change', loggedIn, require(routes + 'accounts/get/changEmail'));
app.post('/account/email/change', loggedIn, require(routes + 'accounts/post/changEmail'));

app.get('/account_activated', require(routes + 'accounts/get/register'));
app.get('/password_resetted', require(routes + 'accounts/get/resetPassword'));
app.get('/client', require(routes + 'client'));
app.get('/livestream', require(routes + 'livestream'));
app.get('/contribution', require(routes + 'contribution'));
app.get('/calendar', require(routes + 'calendar'));
app.get('/competitive/tournaments', require(routes + 'tournaments'));
app.get('/competitive/leaderboards/1v1', require(routes + '1v1'));
app.get('/competitive/leaderboards/global', require(routes + 'global'));
app.get('/news/', require(routes + 'blog'));
app.get('/category/:category/page/:page', require(routes + 'blog'));
app.get('/news/search/:search/page/:page', require(routes + 'blog'));
app.get('/tag/:tag/page/:page', require(routes + 'blog'));
app.get('/author/:author/page/:page', require(routes + 'blog'));
app.get('/news/page/:page', require(routes + 'blog'));
app.get('/:year/:month/:slug', require(routes + 'post'));

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/login', passport.authenticate('faforever', { failureRedirect: '/login', failureFlash: true }), function(req, res) {
	req.logout();
	res.redirect('/');
});

passport.use('faforever', new OAuthStrategy({
		tokenURL: process.env.API_URL + '/oauth/token',
		authorizationURL: process.env.API_URL + '/oauth/authorize',
		clientID: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		callbackURL: process.env.HOST + '/callback',
		scope: ['write_account_data', 'public_profile']
	},
	function(token, tokenSecret, profile, done) {
		var request = require('request');
		request.get(
			{url: process.env.API_URL + '/players/me', headers: {'Authorization':'Bearer ' + token}},
			function (e, r, body) {
				var user = JSON.parse(body);
				user.data.attributes.token = token;
				return done(null, user);
			}
		);

	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(id, done) {
	done(null, id);
});

app.get('/callback', passport.authenticate('faforever', { failureRedirect: '/login', failureFlash: true }), function (req, res, next) {
	res.redirect(req.session.referral ? req.session.referral : '/');
	req.session.referral = null;
});

//404 Error Handler
app.use(function(req, res, next) {
	res.status(404).render('errors/404');
});

//Display 500 Error Handler if in development mode.
if (process.env.NODE_ENV == 'development') {
	app.enable('verbose errors');
	
	//500 Error Handler
	app.use(function (err, req, res, next) {
		res.status(500).render('errors/500', {error: err});
	});
}

//Start and listen on port
app.listen(process.env.PORT, function () {
	console.log('Express listening on port ' + process.env.PORT);
});
