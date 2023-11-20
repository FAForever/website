/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function(req, res, next) {
	let locals = res.locals;
	locals.navLinks = [];
  locals.cNavLinks = [];
  next();
};

exports.clientChecks = function(req, res, next) {
    let locals = res.locals;
    locals.removeNavigation = false;
 
    let userAgent = req.headers['user-agent'];
    if (userAgent === 'downlords-faf-client') {
        locals.removeNavigation = true;
    }
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
