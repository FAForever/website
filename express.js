const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
require('./scripts/discord');
require('./scripts/database');
const app = express();

//Routes
const newsRoute = require('./scripts/getNews');

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
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

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
app.use(newsRoute);


//Start and listen on port
app.listen(3000, () => {
  console.log('Express listening on port ' + 3000);
});

app.get('/login', passport.authenticate('discord'));

app.get('/login/redirect/', passport.authenticate('discord', {
  failureRedirect: '/',
}), function(req, res) {
  console.log('You did it!');
  res.redirect('/newshub'); // Successful auth
});

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
function loggedIn(req, res, next) {
  if (req.isAuthenticated() ) {
    next();
  } else {
    res.redirect('/login');
  }
}
//All Pages
// when the website is asked to render "/pageName" it will come here and see what are the "instructions" to render said page. If the page isn't here, then the website won't render it properly.
let appGetRouteArray = [
  // This first '' is the home/index page
  '', 'client-news', 'newshub', 'campaign-missions', 'scfa-vs-faf', 'donation', 'tutorials-guides', 'ai', 'patchnotes', 'faf-teams', 'contribution', 'content-creators', 'tournaments', 'training', 'leaderboards', 'play', 'tos', 'tos-ru', 'tos-fr', 'newsArticle',
  
  
  
  'account/create', 'account/register',
];
//Renders every page written above
appGetRouteArray.forEach(page => app.get(`/${page}`,loggedIn, (req, res) => {
  res.render(page);
}));

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

