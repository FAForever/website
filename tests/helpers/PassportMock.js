const passport = require('passport')
const StrategyMock = require('./StrategyMock')

module.exports = function (app, options) {
    passport.use(new StrategyMock(options))

    app.get(
        '/mock-login',
        passport.authenticate('mock', {
            failureRedirect: '/mock/login',
            failureFlash: true,
        }),
        (req, res) => {
            res.redirect('/')
        }
    )
}
