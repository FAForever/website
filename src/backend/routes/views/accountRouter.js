const express = require('../../ExpressApp')
const router = express.Router()
const middlewares = require('../middleware')

router.get(
    '/linkGog',
    middlewares.isAuthenticated(),
    require('./account/get/linkGog')
)
router.post(
    '/linkGog',
    middlewares.isAuthenticated(),
    require('./account/post/linkGog')
)

router.get(
    '/report',
    middlewares.isAuthenticated(),
    require('./account/get/report')
)
router.post(
    '/report',
    middlewares.isAuthenticated(),
    require('./account/post/report')
)

router.get(
    '/changePassword',
    middlewares.isAuthenticated(),
    require('./account/get/changePassword')
)
router.post(
    '/changePassword',
    middlewares.isAuthenticated(),
    require('./account/post/changePassword')
)

router.get(
    '/changeEmail',
    middlewares.isAuthenticated(),
    require('./account/get/changeEmail')
)
router.post(
    '/changeEmail',
    middlewares.isAuthenticated(),
    require('./account/post/changeEmail')
)

router.get(
    '/changeUsername',
    middlewares.isAuthenticated(),
    require('./account/get/changeUsername')
)
router.post(
    '/changeUsername',
    middlewares.isAuthenticated(),
    require('./account/post/changeUsername')
)

router.get('/checkUsername', require('./checkUsername'))
router.get(
    '/resync',
    middlewares.isAuthenticated(),
    require('./account/get/resync')
)
router.get(
    '/link',
    middlewares.isAuthenticated(),
    require('./account/get/linkSteam')
)
router.get(
    '/connect',
    middlewares.isAuthenticated(),
    require('./account/get/connectSteam')
)

module.exports = router
