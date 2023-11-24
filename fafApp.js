const appConfig = require("./config/app")
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport')
const flash = require('connect-flash')
const middleware = require('./routes/middleware')
const defaultRouter = require("./routes/views/defaultRouter")
const authRouter = require("./routes/views/auth")
const staticMarkdownRouter = require("./routes/views/staticMarkdownRouter")
const newsRouter = require("./routes/views/news")
const leaderboardRouter = require("./routes/views/leaderboardRouter")
const clanRouter = require("./routes/views/clanRouter")
const accountRouter = require("./routes/views/accountRouter")
const dataRouter = require('./routes/views/dataRouter');
const setupCronJobs = require("./scripts/cron-jobs")
const OidcStrategy = require("passport-openidconnect");
const axios = require("axios");
const refresh = require("passport-oauth2-refresh");

const copyFlashHandler = (req, res, next) => {
    res.locals.message = req.flash();
    next();
}
const notFoundHandler = (req, res) => {
    res.status(404).render('errors/404');
}

const errorHandler = (err, req, res, next) => {
    console.error('[error] Incoming request to"', req.originalUrl, '"failed with error "', err.toString(), '"')
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).render('errors/500');
}

const loadAuth = () => {
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    const authStrategy = new OidcStrategy({
            issuer: appConfig.oauth.url + '/',
            tokenURL: appConfig.oauth.url + '/oauth2/token',
            authorizationURL: appConfig.oauth.publicUrl + '/oauth2/auth',
            userInfoURL: appConfig.oauth.url + '/userinfo?schema=openid',
            clientID: appConfig.oauth.clientId,
            clientSecret: appConfig.oauth.clientSecret,
            callbackURL: `${appConfig.host}/${appConfig.oauth.callback}`,
            scope: ['openid', 'offline', 'public_profile', 'write_account_data']
        }, function (iss, sub, profile, jwtClaims, accessToken, refreshToken, params, verified) {

            axios.get(
                appConfig.apiUrl + '/me',
                {
                    headers: {'Authorization': `Bearer ${accessToken}`}
                }).then((res) => {
                const user = res.data
                user.token = accessToken
                user.refreshToken = refreshToken
                user.data.attributes.token = accessToken;
                user.data.id = user.data.attributes.userId;

                return verified(null, user);
            }).catch(e => {
                console.error('[Error] views/auth.js::passport::verify failed with "' + e.toString() + '"');

                return verified(null, null);
            });
        }
    )

    passport.use(appConfig.oauth.strategy, authStrategy)
    refresh.use(appConfig.oauth.strategy, authStrategy)
}

module.exports.setupCronJobs = () => {
    setupCronJobs()
}

module.exports.startServer = (app) => {
    app.listen(appConfig.expressPort, () => {
        console.log(`Express listening on port ${appConfig.expressPort}`);
    });
}

module.exports.loadRouters = (app) => {
    app.use('/', defaultRouter)
    app.use('/', authRouter)
    app.use('/', staticMarkdownRouter)
    app.use('/news', newsRouter)
    app.use('/leaderboards', leaderboardRouter)
    app.use('/clans', clanRouter)
    app.use('/account', accountRouter)
    app.use('/data', dataRouter)

    app.use(notFoundHandler)
    app.use(errorHandler)
}

module.exports.setup = (app) => {
    app.locals.clanInvitations = {}

    app.set('views', 'templates/views')
    app.set('view engine', 'pug')
    app.set('port', appConfig.expressPort)

    
    app.use(middleware.initLocals)

    app.use(express.static('public', {
        immutable: true,
        maxAge: 4 * 60 * 60 * 1000 // 4 hours
    }))

    app.use(express.json())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))

    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: appConfig.session.key,
        store: new FileStore({
            retries: 0,
            ttl: appConfig.session.tokenLifespan,
            secret: appConfig.session.key
        })
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    loadAuth()
    
    app.use(middleware.injectServices)
    
    app.use(flash())
    app.use(middleware.username)
    app.use(copyFlashHandler)
}
