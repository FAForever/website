exports.isAuthenticated = (redirectUrlAfterLogin = null, isApiRequest = false) => {
    return (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }

        if (req.xhr || req.headers?.accept?.indexOf('json') > -1 || isApiRequest) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        if (req.session) {
            req.session.returnTo = redirectUrlAfterLogin || req.originalUrl
        }

        return res.redirect('/login')
    }
}
