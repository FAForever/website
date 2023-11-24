const WordpressServiceFactory = require("../lib/WordpressServiceFactory")
const JavaApiClientFactory = require("../lib/JavaApiClient")
const appConfig = require("../config/app")
const LeaderboardService = require("../lib/LeaderboardService")
const cacheService = require("../lib/CacheService")
const LeaderboardRepository = require("../lib/LeaderboardRepository")
const ClanService = require("../lib/clan/ClanService")
const ClanRepository = require("../lib/clan/ClanRepository")
const wordpressService = WordpressServiceFactory(appConfig.wordpressUrl)

exports.initLocals = function(req, res, next) {
	let locals = res.locals;
	locals.navLinks = [];
  locals.cNavLinks = [];
  next();
};

exports.username = function(req, res, next) {
  var locals = res.locals;

  if (req.isAuthenticated()) {
    locals.username = req.user.data.attributes.userName;
    locals.hasClan =
      req.user && req.user.data.attributes.clan;
  }

  next();
};

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

exports.injectServices =  function(req, res, next) {
    req.services = {
        wordpressService: wordpressService
    }
    
    if (req.isAuthenticated()) {
        req.services.javaApiClient = JavaApiClientFactory(appConfig.apiUrl, req.user)
        req.services.leaderboardService = new LeaderboardService(cacheService, new LeaderboardRepository(req.services.javaApiClient))
        req.services.clanService = new ClanService(cacheService, new ClanRepository(req.services.javaApiClient))
    }

    next()
}
