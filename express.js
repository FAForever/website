const express = require('express');
const showdown = require('showdown');
const request = require('request');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const fs = require('fs');
let OidcStrategy = require('passport-openidconnect');
const middleware = require('./routes/middleware');
const app = express();

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

//Execute Middleware
app.use(middleware.initLocals);
app.use(middleware.getLatestClientRelease);
app.use(middleware.clientChecks);

//Set static public directory path
app.use(express.static('public', {
  immutable: true,
  maxAge: 4 * 60 * 60 * 1000 // 4 hours
}));


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
app.use(middleware.username);
app.use(middleware.flashMessage);

//Initialize values for default configs
app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', 3000);

app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});

function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}





//Start and listen on port
app.listen(3000, () => {
  console.log('Express listening on port ' + 3000);
});


// --- R O U T E S ---
// when the website is asked to render "/pageName" it will come here and see what are the "instructions" to render said page. If the page isn't here, then the website won't render it properly.

// --- UNPROTECTED ROUTES ---
const appGetRouteArray = [
  // This first '' is the home/index page
  '', 'client-news', 'newshub', 'campaign-missions', 'scfa-vs-faf', 'donation', 'tutorials-guides', 'ai', 'patchnotes', 'faf-teams', 'contribution', 'content-creators', 'tournaments', 'training', 'leaderboards', 'play', 'newsArticle', 'clans',];

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

app.get('/renderMe', (req, res) => {
  res.render(`account/report`);
});

const clansRoutesGet = [
  'create', 'manage', 'accept_invite',];
clansRoutesGet.forEach(page => app.get(`/clans/${page}`, loggedIn, require(`${routes}clans/get/${page}`)));

const clansRoutesPost = [
  'create', 'destroy', 'invite', 'kick', 'transfer', 'update', 'leave', 'join',];
clansRoutesPost.forEach(page => app.post(`/clans/${page}`, loggedIn, require(`${routes}clans/post/${page}`)));


//When searching for a specific clan
app.get('/clans/*', (req, res) => {
  res.render(`clans/seeClan`);
});


// Markdown Routes

// ToS and Privacy Statement
function markdown(template) {
  let html = new showdown.Converter().makeHtml(fs.readFileSync(template, 'utf-8'));
  return (req, res) => {
    res.render('markdown', {content: html});
  };
}

app.get('/privacy', markdown('templates/views/markdown/privacy.md'));
app.get('/privacy-fr', markdown('templates/views/markdown/privacy-fr.md'));
app.get('/privacy-ru', markdown('templates/views/markdown/privacy-ru.md'));
app.get('/tos', markdown('templates/views/markdown/tos.md'));
app.get('/tos-fr', markdown('templates/views/markdown/tos-fr.md'));
app.get('/tos-ru', markdown('templates/views/markdown/tos-ru.md'));
app.get('/rules', markdown('templates/views/markdown/rules.md'));
app.get('/cg', markdown('templates/views/markdown/cg.md'));


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
app.get('/account/register', require(routes + 'account/get/register'));
app.post('/account/register', require(routes + 'account/post/register'));

app.get('/account/activate', require(routes + 'account/get/activate'));
app.post('/account/activate', require(routes + 'account/post/activate'));

app.get('/account/checkUsername', require('./routes/views/checkUsername'));
app.get('/password_resetted', require(routes + 'account/get/requestPasswordReset'));
app.get('/report_submitted', require(routes + 'account/get/report'));
// Download Client
app.get('/client', (req, res) => {
  let locals = res.locals;
  res.redirect(locals.downlords_faf_client_download_link);
});


app.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Login and Login/redirect routes
app.get('/login', passport.authenticate('faforever'));



passport.use('faforever', new OidcStrategy({
    issuer: process.env.OAUTH_URL + '/',
    tokenURL: process.env.OAUTH_URL + '/oauth2/token',
    authorizationURL: process.env.OAUTH_URL + '/oauth2/auth',
    userInfoURL: process.env.OAUTH_URL + '/userinfo?schema=openid',
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/callback',
    scope: ['openid', 'public_profile', 'write_account_data']
  }, function (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verified) {
    
    request.get(
      {url: process.env.API_URL + '/me', headers: {'Authorization': 'Bearer ' + accessToken}},
      function (e, r, body) {
        if (r.statusCode !== 200) {
          return verified(null);
        }
        let user = JSON.parse(body);
        user.data.attributes.token = accessToken;
        user.data.id = user.data.attributes.userId;
        console.log(user.data);
        return verified(null, user);
      }
    );
  }
));


passport.serializeUser(async function (user, done) {
  await done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


app.get('/callback', passport.authenticate('faforever', {
  failureRedirect: '/login', // Failed auth
}), function (req, res) {
  res.redirect(req.session.referral ? req.session.referral : '/');
  req.session.referral = null; // Successful auth
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
  }, process.env.EXTRACTOR_INTERVAL * 60 * 1000); 
}
setInterval(() => {
  try {
    require(`./scripts/getRecentUsers`).run();

  } catch (e) {
    console.error(`getRecentUsers script caused the error`, e);
  }
}, process.env.PLAYER_COUNT_INTERVAL * 1000); 


//404 Error Handlers
app.use(function (req, res) {
  res.status(404).render('errors/404');
});
app.use(function (req, res) {
  res.status(500).render('errors/500');
});
 
