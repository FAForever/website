const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
require('./scripts/discord');
require('./scripts/database');
const app = express();

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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1000 * 60 * 60}, // 1 hour

  store: mongoStore.create({
    mongoUrl: process.env.MONGO
  })

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
app.get('/login', passport.authenticate('discord'));

app.get('/login/redirect/', passport.authenticate('discord', {
  failureRedirect: '/login',
}), function (req, res) {
  console.log('You did it!');
  res.redirect('/'); // Successful auth
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
app.get('/account/link', loggedIn, require(routes + 'account/get/linkSteam'));
app.get('/account/connect', loggedIn, require(routes + 'account/get/connectSteam'));
app.get('/account/link', loggedIn, require(routes + 'account/get/linkSteam'));
app.get('/account/resync', loggedIn, require(routes + 'account/get/resync'));
app.get('/account/connect', loggedIn, require(routes + 'account/get/connectSteam'));
// Not Protected
app.get('/account/create', require(routes + 'account/get/createAccount'));
app.get('/account_activated', require(routes + 'account/get/register'));
app.get('/account/checkUsername', require('./routes/views/checkUsername'));
app.get('/password_resetted', require(routes + 'account/get/requestPasswordReset'));
app.get('/report_submitted', require(routes + 'account/get/report'));
// Download Client
app.get('/client', (req,res)=>{
  let locals = res.locals;
  res.redirect(locals.downlords_faf_client_download_link);
});

/*

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
 */
