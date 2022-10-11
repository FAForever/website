const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
let OidcStrategy = require('passport-openidconnect');
const app = express();

app.locals.clanInvitations = {};
console.log(' Changeeeeeeeees are here');
console.log(' Changeeeeeeeees are here');
console.log(' Changeeeeeeeees are here');
console.log(' Changeeeeeeeees are here');
console.log(' Changeeeeeeeees are here');

//Define environment variables with default values
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '4000';
process.env.OAUTH_URL = process.env.OAUTH_URL || 'https://hydra.test.faforever.com';
process.env.API_URL = process.env.API_URL || 'https://api.faforever.com';
process.env.OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || '12345';
process.env.OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || '12345';
process.env.HOST = process.env.HOST || 'http://localhost';
process.env.SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || '12345';

//Initialize values for default configs
app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', 3000);

//Set static public directory path
app.use(express.static('public', {
  immutable: true,
  maxAge: 4 * 60 * 60 * 1000 // 4 hours
}));

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Session determines how long will the user be logged in/authorized in the website
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: process.env.TOKEN_LIFESPAN * 1000
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(require('./scripts/getNews'));
app.use(flash());


//Start and listen on port
app.listen(3000, () => {
  console.log('Express listening on port ' + 3000);
});

// Login and Login/redirect routes
app.get('/login', passport.authenticate('faforever'));

app.get('/login/redirect/', passport.authenticate('faforever', {
  failureRedirect: '/faf-teams',
}), function (req, res) {
  res.redirect('/tournaments'); // Successful auth
});

app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}
/*
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
        let user = JSON.parse(body);
        user.data.attributes.token = accessToken;
        user.data.id = user.data.attributes.userId;
        return verified(null, user);
      });
  }
));

 */

passport.use('faforever', new OidcStrategy({
   issuer: process.env.OAUTH_URL + '/',
   tokenURL: process.env.OAUTH_URL + '/oauth2/token',
   authorizationURL: process.env.OAUTH_URL + '/oauth2/auth',
   //userInfoURL: process.env.OAUTH_URL + '/userinfo?schema=openid',
   clientID: process.env.OAUTH_CLIENT_ID,
   clientSecret: process.env.OAUTH_CLIENT_SECRET,
   callbackURL: process.env.HOST + '/callback',
   scope: ['openid', 'public_profile', 'write_account_data']
 },
 function (accessToken, refreshToken, profile, cb) {
   console.log('Console log strategy');
   console.log(accessToken,refreshToken,profile,cb);
   let user = profile;
   return cb(null, user);
 }
));



passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

app.get('/callback', passport.authenticate('faforever', {
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res, next) {
  res.redirect(req.session.referral ? req.session.referral : '/');
  req.session.referral = null;
});
// --- R O U T E S ---
// when the website is asked to render "/pageName" it will come here and see what are the "instructions" to render said page. If the page isn't here, then the website won't render it properly.

// --- UNPROTECTED ROUTES ---
const appGetRouteArray = [
  // This first '' is the home/index page
  '', 'client-news', 'newshub', 'campaign-missions', 'scfa-vs-faf', 'donation', 'tutorials-guides', 'ai', 'patchnotes', 'faf-teams', 'contribution', 'content-creators', 'tournaments', 'training', 'leaderboards', 'play', 'tos', 'tos-ru', 'tos-fr', 'newsArticle', 'account/createAccount', 'account/register', 'account/activate',];

//Renders every page written above
appGetRouteArray.forEach(page => app.get(`/${page}`, (req, res) => {
  res.render(page);
}));

/*
// List of route name changes
 reset > requestPasswordReset
 confirmReset > confirmPasswordReset
 change > changePassword, changeUsername, changeEmail
 */

// Account routes
// These routes are protected by the 'loggedIn' function (which verifies if user is serialized/deserialized or logged in [same thing]).
const accountRoutePath = './routes/views/account';
const accountRoutes = [
  'linkGog', 'requestPasswordReset', 'confirmPasswordReset', 'report', 'changePassword', 'changeEmail', 'changeUsername',];

accountRoutes.forEach(page => app.post(`/account/${page}`, loggedIn, require(`${accountRoutePath}/post/${page}`)));

accountRoutes.forEach(page => app.get(`/account/${page}`, loggedIn, require(`${accountRoutePath}/get/${page}`)));


// --- C L A N S ---
const routes = './routes/views/';
app.get('/clans', require(routes + 'clans/get/index'));

const clansRoutesGet = [
  'create', 'manage', 'see', 'browse', 'accept_invite',];
clansRoutesGet.forEach(page => app.get(`/clans/${page}`, loggedIn, require(`${routes}clans/get/${page}`)));

const clansRoutesPost = [
  'create', 'destroy', 'invite', 'kick', 'transfer', 'update', 'leave', 'join',];
clansRoutesPost.forEach(page => app.post(`/clans/${page}`, loggedIn, require(`${routes}clans/post/${page}`)));


// ---ODD BALLS---
// Routes that might not be able to be added into the loops due to their nature in naming
/* Removed
  client.js (was made its own code below)
  lobby_api (not in use in the new website)
 */
// Protected
app.get('/account/linkSteam', loggedIn, require(routes + 'account/get/linkSteam'));
app.get('/account/connectSteam', loggedIn, require(routes + 'account/get/connectSteam'));
app.get('/account/resync', loggedIn, require(routes + 'account/get/resync'));
// Not Protected
app.get('/account/create', require(routes + 'account/get/createAccount'));
app.get('/account_activated', require(routes + 'account/get/register'));
app.get('/account/checkUsername', require('./routes/views/checkUsername'));
app.get('/password_resetted', require(routes + 'account/get/requestPasswordReset'));
app.get('/report_submitted', require(routes + 'account/get/report'));
// Download Client
app.get('/client', (req, res) => {
  let locals = res.locals;
  res.redirect(locals.downlords_faf_client_download_link);
});


// Run scripts initially on startup
let requireRunArray = ['extractor', 'getLatestClientRelease'];
for (let i = 0; i < requireRunArray.length; i++) {
  try {
    require(`./scripts/${requireRunArray[i]}`).run();
  } catch (e) {
    console.error(`Error running ${requireRunArray[i]} script. Make sure the API is available (will try again after interval).`, e);
  }
// Interval for scripts
  setInterval(() => {
    try {
      require(`./scripts/${requireRunArray[i]}`).run();
    } catch (e) {
      console.error(`${requireRunArray[i]} caused the error`, e);
    }
  }, 1000 * 60 * 5); // 5 Minutes
}
setInterval(() => {
  try {
    require(`./scripts/getRecentUsers`).run();

  } catch (e) {
    console.error(`getRecentUsers script caused the error`, e);
  }
}, 1000 * 30); // 30 seconds


//404 Error Handlers
app.use(function (req, res) {
  res.status(404).render('errors/404');
});
 
