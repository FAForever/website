const WordpressServiceFactory = require("../lib/WordpressServiceFactory");
const {JavaApiClientFactory} = require('../lib/JavaApiClientFactory')
const LeaderboardService = require('../lib/LeaderboardService')
const LeaderboardRepository = require('../lib/LeaderboardRepository')
const cacheService = require('../lib/CacheService')
const appConfig = require("../config/app");
const wordpressService = WordpressServiceFactory(appConfig.wordpressUrl)
const fs = require('fs');
const webpackManifestJS = JSON.parse(fs.readFileSync('dist/js/manifest.json', 'utf8'));
const LoggedInUserService = require('../lib/LoggedInUserService')
const UserRepository = require('../lib/UserRepository');
    

exports.initLocals = function(req, res, next) {
	let locals = res.locals;
	locals.navLinks = [];
  locals.cNavLinks = [];
  next();
};

exports.webpackAsset = (req, res, next) => {
    res.locals.webpackAssetJS = (asset) => {
        if (asset in webpackManifestJS) {
            return webpackManifestJS[asset]
        }
        
        throw new Error('[error] middleware::webpackAsset Failed to find asset "' + asset + '"')
    }
    
    next()
}

exports.populatePugGlobals = function (req, res, next) {
    res.locals.appGlobals = {
        loggedInUser: null
    }
    
    if (req.isAuthenticated()) {
        res.locals.appGlobals.loggedInUser = req.services.userService.getUser()
    }
    next()
}

exports.isAuthenticated = (redirectUrlAfterLogin = null, isApiRequest = false) => {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }

        if (req.xhr || req.headers?.accept?.indexOf('json') > -1 || isApiRequest) {
            return res.status(401).json({error: 'Unauthorized'})
        }

        if (req.session) {
            req.session.returnTo = redirectUrlAfterLogin || req.originalUrl
        }

        return res.redirect('/login')
    }
}

exports.injectServices = (req, res, next) => {
    req.services = {}
    req.services.wordpressService = wordpressService

    if (req.isAuthenticated()) {
        try {
            req.services.javaApiClient = JavaApiClientFactory(appConfig.apiUrl, req.user.oAuthPassport)
            req.services.userService = new LoggedInUserService(new UserRepository(req.services.javaApiClient), req)
            req.services.leaderboardService = new LeaderboardService(cacheService, new LeaderboardRepository(req.services.javaApiClient))
        } catch (e) {
            req.logout(() => next(e))
        }
    }

    next()
}
