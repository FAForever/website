// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

let express = require('express');
let middleware = require('./routes/middleware');
let bodyParser = require('body-parser');
let passport = require('passport');
let OidcStrategy = require('passport-openidconnect');
let flash = require('connect-flash');
const cors = require('cors');
let app = express();

app.locals.clanInvitations = {};

//Define environment variables with default values
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '4000';
process.env.OAUTH_URL = process.env.OAUTH_URL || 'https://hydra.test.faforever.com';
process.env.API_URL = process.env.API_URL || 'https://api.faforever.com';
process.env.OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || '12345';
process.env.OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '12345';
process.env.HOST = process.env.HOST || 'http://localhost';
process.env.SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || '12345';

//Execute middleware before each request...
app.use(middleware.initLocals);
app.use(middleware.getLatestClientRelease);
app.use(middleware.clientChecks);


//Set static public directory path
app.use(express.static('public', {
  immutable: true,
  maxAge: 4 * 60 * 60 * 1000 // 4 hours
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: process.env.TOKEN_LIFESPAN * 1000
  }
}));

//Authentication on pages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(middleware.username);

//Initialize values for default configs
app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', process.env.PORT);



//Define routes


function loggedIn(req, res, next) {
  req.session.referral = req.protocol + '://' + req.get('host') + req.originalUrl;
  if (req.isAuthenticated()) {
    res.locals.username = req.user.data.attributes.userName;
    next();
  } else {
    res.redirect('/login');
  }
}
// Account routes
// Registration

//Variable to hold routing path
let routes = './routes/views/';

app.get('/account/register', require(routes + 'accounts/get/register'));
app.post('/account/register', require(routes + 'accounts/post/register'));

app.get('/account/activate', require(routes + 'accounts/get/activate'));
app.post('/account/activate', require(routes + 'accounts/post/activate'));

// Callback for registration to create the account using a token
app.get('/account/create', require(routes + 'accounts/get/createAccount'));

app.get('/account/link', loggedIn, require(routes + 'accounts/get/linkSteam'));
app.get('/account/resync', loggedIn, require(routes + 'accounts/get/resync'));

app.get('/account/connect', loggedIn, require(routes + 'accounts/get/connectSteam'));

app.get('/account/password/reset', require(routes + 'accounts/get/requestPasswordReset'));
app.post('/account/password/reset', require(routes + 'accounts/post/requestPasswordReset'));

app.get('/account/password/confirmReset', require(routes + 'accounts/get/confirmPasswordReset'));
app.post('/account/password/confirmReset', require(routes + 'accounts/post/confirmPasswordReset'));

app.get('/account/report', loggedIn, require(routes + 'accounts/get/report'));
app.post('/account/report', loggedIn, require(routes + 'accounts/post/report'));

app.get('/account/password/change', loggedIn, require(routes + 'accounts/get/changePassword'));
app.post('/account/password/change', loggedIn, require(routes + 'accounts/post/changePassword'));

app.get('/account/username/change', loggedIn, require(routes + 'accounts/get/changeUsername'));
app.post('/account/username/change', loggedIn, require(routes + 'accounts/post/changeUsername'));

app.get('/account/email/change', loggedIn, require(routes + 'accounts/get/changeEmail'));
app.post('/account/email/change', loggedIn, require(routes + 'accounts/post/changeEmail'));

app.get('/account_activated', require(routes + 'accounts/get/register'));
app.get('/password_resetted', require(routes + 'accounts/get/requestPasswordReset'));
app.get('/report_submitted', require(routes + 'accounts/get/report'));


//All Pages
// when the website is asked to render "/pageName" it will come here and see what are the "instructions" to render said page. If the page isn't here, then the website won't render it properly.    
let appGetRouteArray = [
  // This first '' is the home/index page
  '',
  'client-news',
  'newshub',
  'campaign-missions',
  'scfa-vs-faf',
  'donation',
  'tutorials-guides',
  'ai',
  'patchnotes',
  'faf-teams',
  'contribution',
  'content-creators',
  'tournaments',
  'training',
  'leaderboards',
  'play',
  'tos',
  'tos-ru',
  'tos-fr',
  'newsArticle',
];
//Renders every page written above
appGetRouteArray.forEach(page => app.get(`/${page}`, (req,res) => {
  res.render(page);
}));




app.get('/lobby_api', cors(), require('./routes/lobby_api'));
app.get('/account/checkUsername', require('./routes/views/accounts/get/checkUsername'));

// Clans
app.get('/clans', require(routes + 'clans/get/index'));
app.get('/clans/create', loggedIn, require(routes + 'clans/get/create'));
app.get('/clans/manage', loggedIn, require(routes + 'clans/get/manage'));
app.get('/clans/see', require(routes + 'clans/get/see'));
app.get('/clans/browse', require(routes + 'clans/get/browse'));
app.get('/clans/accept', loggedIn, require(routes + 'clans/get/accept'));

app.post('/clans/create', loggedIn, require(routes + 'clans/post/create'));
app.post('/clans/destroy', loggedIn, require(routes + 'clans/post/destroy'));
app.post('/clans/invite', loggedIn, require(routes + 'clans/post/invite'));
app.post('/clans/kick', loggedIn, require(routes + 'clans/post/kick'));
app.post('/clans/transfer', loggedIn, require(routes + 'clans/post/transfer'));
app.post('/clans/update', loggedIn, require(routes + 'clans/post/update'));
app.post('/clans/leave', loggedIn, require(routes + 'clans/post/leave'));

// Compatibility
app.get('/clan/*', function (req, res) {
  const id = req.path.split('/').slice(-1)[0];
  res.redirect('/clans/see?id=' + id);

});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/login', passport.authenticate('faforever', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/callback', passport.authenticate('faforever', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) {
  res.redirect(req.session.referral ? req.session.referral : '/');
  req.session.referral = null;
});

passport.use('faforever', new OidcStrategy({
    issuer: process.env.OAUTH_URL + '/',
    tokenURL: process.env.OAUTH_URL + '/oauth2/token',
    authorizationURL: process.env.OAUTH_URL + '/oauth2/auth',
    userInfoURL: process.env.OAUTH_URL + '/userinfo?schema=openid',
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/callback',
    scope: ['openid', 'public_profile', 'write_account_data']
  },
  function (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verified) {
    let request = require('request');
    request.get(
      {url: process.env.API_URL + '/me', headers: {'Authorization': 'Bearer ' + accessToken}},
      function (e, r, body) {
        if (r.statusCode !== 200) {
          return verified(null);
        }
        let user = JSON.parse(body);
        user.data.attributes.token = accessToken;
        user.data.id = user.data.attributes.userId;
        return verified(null, user);
      }
    );
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

const newsRoute = require('./scripts/getNews');
app.use(newsRoute);

// Run scripts initially on startup
let requireRunArray = ['extractor', 'getLatestClientRelease', 'getRecentUsers' ];
for (let i = 0; i < requireRunArray.length; i++) {
  try {
    require(`./scripts/${requireRunArray[i]}`).run();
  } catch (e) {
    console.error(`Error running ${requireRunArray[i]} script. Make sure the API is available (will try again after interval).`, e);
  }
  // Run leaderboard extractor every 900 seconds / 15 minutes
  setInterval(() => {
    try {
      require(`./scripts/${requireRunArray[i]}`).run();
    } catch (e) {
      console.error(`${requireRunArray[i]} caused the error`, e);
    }
  },  1000 * 60 * 5); // 5 Minutes
}

//Start and listen on port
app.listen(process.env.PORT,() => {
  console.log('Express listening on port ' + process.env.PORT);
});


//404 Error Handlers
app.use(function (req, res) {
  res.status(404).render('errors/404');
});



//Display 500 Error Handler if in development mode.
if (process.env.NODE_ENV === 'development') {
  app.enable('verbose errors');

  //500 Error Handler
  app.use(function (err, req, res) {
    res.status(500).render('errors/500', {error: err});
  });
}

/*app.use( (err, req, res, next) => {
  res.status(!200).render('error/error');
});
*/
