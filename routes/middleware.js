const WordpressServiceFactory = require("../lib/WordpressServiceFactory");
const appConfig = require("../config/app");
const wordpressService = WordpressServiceFactory(appConfig.wordpressUrl)
const fs = require('fs');
const webpackManifestJS = JSON.parse(fs.readFileSync('dist/js/manifest.json', 'utf8'));

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

    next()
}
