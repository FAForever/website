const appConfig = require('./config/app')
const express = require('express');
const showdown = require('showdown');
const passport = require('passport');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const setupCronJobs = require('./scripts/cron-jobs');
const middleware = require('./routes/middleware');
const app = express();
const newsRouter = require('./routes/views/news');
const staticMarkdownRouter = require('./routes/views/staticMarkdownRouter');
const leaderboardRouter = require('./routes/views/leaderboardRouter');
const authRouter = require('./routes/views/auth');

app.locals.clanInvitations = {};

//Execute Middleware
app.use(middleware.initLocals);
app.use(middleware.clientChecks);

//Set static public directory path
app.use(express.static('public', {
  immutable: true,
  maxAge: 4 * 60 * 60 * 1000 // 4 hours
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    resave: false, 
    saveUninitialized: true,
    secret: appConfig.session.key,
    store: new FileStore({
        retries: 0,
        ttl: appConfig.session.tokenLifespan,
        secret: appConfig.session.key
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(middleware.username);

//Initialize values for default configs
app.set('views', 'templates/views');
app.set('view engine', 'pug');
app.set('port', appConfig.expressPort);

app.use(function(req, res, next){
  res.locals.message = req.flash();
  next();
});

let fullUrl = '/';

function loggedIn(req, res, next) {
  
  fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  if (req.isAuthenticated()) {
    res.locals.username = req.user.data.attributes.userName;
    next();
  } else {
    res.redirect('/login');
  }
}

app.use('/', authRouter)
app.use('/', staticMarkdownRouter)
app.use('/news', newsRouter)
app.use('/leaderboards', leaderboardRouter)

// --- UNPROTECTED ROUTES ---
const appGetRouteArray = [
  // This first '' is the home/index page
  '', 'newshub', 'campaign-missions', 'scfa-vs-faf', 'donation', 'tutorials-guides', 'ai', 'patchnotes', 'faf-teams', 'contribution', 'content-creators', 'tournaments', 'training', 'play', 'clans',];

//Renders every page written above
appGetRouteArray.forEach(page => app.get(`/${page}`, (req, res) => {
  // disabled due https://github.com/FAForever/website/issues/445
  if (page === 'clans') {
    return res.status(503).render('errors/503-known-issue')
  }
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
const protectedAccountRoutes = [
  'linkGog', 'report', 'changePassword', 'changeEmail', 'changeUsername',];

protectedAccountRoutes.forEach(page => app.post(`/account/${page}`, loggedIn, require(`${accountRoutePath}/post/${page}`)));

protectedAccountRoutes.forEach(page => app.get(`/account/${page}`, loggedIn, require(`${accountRoutePath}/get/${page}`)));


//Password reset routes
const passwordResetRoutes = ['requestPasswordReset', 'confirmPasswordReset'];

passwordResetRoutes.forEach(page => app.post(`/account/${page}`, require(`${accountRoutePath}/post/${page}`)));
passwordResetRoutes.forEach(page => app.get(`/account/${page}`, require(`${accountRoutePath}/get/${page}`)));

app.get('/account/password/confirmReset', require(`${accountRoutePath}/get/confirmPasswordReset`));
app.post('/account/password/confirmReset', require(`${accountRoutePath}/post/confirmPasswordReset`));

//legacy password reset path for backwards compatibility
app.get('/account/password/reset', require(`${accountRoutePath}/get/requestPasswordReset`));
app.post('/account/password/reset', require(`${accountRoutePath}/post/requestPasswordReset`));


// --- C L A N S ---
const routes = './routes/views/';

const clansRoutesGet = [
  'create', 'manage', 'accept_invite',];
// disabled due https://github.com/FAForever/website/issues/445
// clansRoutesGet.forEach(page => app.get(`/clans/${page}`, loggedIn, require(`${routes}clans/get/${page}`)));
clansRoutesGet.forEach(page => app.get(`/clans/${page}`, loggedIn, (req, res) =>  res.status(503).render('errors/503-known-issue')));

const clansRoutesPost = [
  'create', 'destroy', 'invite', 'kick', 'transfer', 'update', 'leave', 'join',];
// disabled due https://github.com/FAForever/website/issues/445
// clansRoutesPost.forEach(page => app.post(`/clans/${page}`, loggedIn, require(`${routes}clans/post/${page}`)));
clansRoutesPost.forEach(page => app.post(`/clans/${page}`, loggedIn,  (req, res) =>  res.status(503).render('errors/503-known-issue')));


// disabled due https://github.com/FAForever/website/issues/445
//When searching for a specific clan
// app.get('/clans/*', (req, res) => {
//   res.render(`clans/seeClan`);
// });
app.get('/clans/*',  (req, res) =>  res.status(503).render('errors/503-known-issue'));


// ---ODD BALLS---
// Routes that might not be able to be added into the loops due to their nature in naming
/* Removed
  client.js (was made its own code below)
  lobby_api (not in use in the new website)
 */
// Protected

app.get('/account/link', loggedIn, require(routes + 'account/get/linkSteam'));
//app.get('/account/linkSteam', loggedIn, require(routes + 'account/get/linkSteam'));
app.get('/account/connect', loggedIn, require(routes + 'account/get/connectSteam'));
//app.get('/account/connectSteam', loggedIn, require(routes + 'account/get/connectSteam'));
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

setupCronJobs()

//404 Error Handlers
app.use(function (req, res) {
  res.status(404).render('errors/404');
});
app.use(function (err, req, res, next) {
  console.error('[error] Incoming request to"', req.originalUrl, '"failed with error "', err.toString(), '"')
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).render('errors/500');
});

app.listen(appConfig.expressPort, () => {
    console.log(`Express listening on port ${appConfig.expressPort}`);
});
