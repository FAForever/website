const create = require('../views/clans/create')
const invite = require('./clans/invite')
const leave = require('./clans/leave')
const express = require('../../ExpressApp')
const router = express.Router()
const middlewares = require('../middleware')

// This will be replaced soon, therefor I did not spend time on it
router.get('/', (req, res) => res.render('clans/clans'))
router.get('/view/:id', require('./clans/view'))

router.get('/create', middlewares.isAuthenticated(), create)
router.post('/create', middlewares.isAuthenticated(), create)
router.get('/manage', middlewares.isAuthenticated(), require('./clans/get/manage'))
router.post('/update', middlewares.isAuthenticated(), require('./clans/post/update'))
router.post('/destroy', middlewares.isAuthenticated(), require('./clans/post/destroy'))
router.get('/invite', middlewares.isAuthenticated(), invite)
router.post('/invite', middlewares.isAuthenticated(), invite)
router.get('/kick/:memberId', middlewares.isAuthenticated(), require('./clans/kick'))
router.get('/leave', middlewares.isAuthenticated(), leave)
router.post('/leave', middlewares.isAuthenticated(), leave)
router.get('/join', middlewares.isAuthenticated(), require('./clans/join'))
router.get('/invite-accept', middlewares.isAuthenticated(), require('./clans/inviteAccept'))
router.get('*', (req, res) => res.status(503).render('errors/503-known-issue'))

module.exports = router
