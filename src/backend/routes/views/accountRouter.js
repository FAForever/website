const express = require('../../ExpressApp')
const router = express.Router()

const { query } = require('express-validator')
const middlewares = require('../middleware')
const url = require('url')

router.get('/linkGog', middlewares.isAuthenticated(), require('./account/get/linkGog'))
router.post('/linkGog', middlewares.isAuthenticated(), require('./account/post/linkGog'))

router.get('/report', middlewares.isAuthenticated(), require('./account/get/report'))
router.post('/report', middlewares.isAuthenticated(), require('./account/post/report'))

router.get('/changePassword', middlewares.isAuthenticated(), require('./account/get/changePassword'))
router.post('/changePassword', middlewares.isAuthenticated(), require('./account/post/changePassword'))

router.get('/changeEmail', middlewares.isAuthenticated(), require('./account/get/changeEmail'))
router.post('/changeEmail', middlewares.isAuthenticated(), require('./account/post/changeEmail'))

router.get('/changeUsername', middlewares.isAuthenticated(), require('./account/get/changeUsername'))
router.post('/changeUsername', middlewares.isAuthenticated(), require('./account/post/changeUsername'))

router.get('/password/confirmReset', [query('token').notEmpty().withMessage('Token is required'),
    query('Username').notEmpty().withMessage('Username is required')],
require('./account/get/confirmPasswordReset'))
router.post('/password/confirmReset', require('./account/post/confirmPasswordReset'))

router.get('/requestPasswordReset', require('./account/get/requestPasswordReset'))
router.post('/requestPasswordReset', require('./account/post/requestPasswordReset'))

// still used in other applications (user-service, game-client etc.)
router.get('/password/reset', (req, res) => res.redirect('/account/requestPasswordReset'))
router.get('/confirmPasswordReset', (req, res) => {
    res.redirect(url.format({
        pathname: '/account/password/confirmReset',
        query: req.query
    }))
})

router.get('/register', require('./account/get/register'))
router.post('/register', require('./account/post/register'))

router.get('/activate', require('./account/get/activate'))
router.post('/activate', require('./account/post/activate'))

router.get('/checkUsername', require('./checkUsername'))
router.get('/resync', middlewares.isAuthenticated(), require('./account/get/resync'))
router.get('/create', require('./account/get/createAccount'))
router.get('/link', middlewares.isAuthenticated(), require('./account/get/linkSteam'))
router.get('/connect', middlewares.isAuthenticated(), require('./account/get/connectSteam'))

module.exports = router
