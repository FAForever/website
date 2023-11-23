const express = require('express')
const router = express.Router()
const middlewares = require('../middleware')

router.get('/', middlewares.isAuthenticated(), (req, res) => res.render('clans/clans'))
router.get('/view/:id', middlewares.isAuthenticated(), async (req, res) => {
    const clanId = parseInt(req.params.id || null)
    if (!clanId) {
        return res.redirect('/clans')
    }

    return res.render('clans/clan', {clan: await req.services.clanService.getClan(clanId)})
})

// router.get('/create', middlewares.isAuthenticated(), require('./clans/get/create'))
// router.get('/manage', middlewares.isAuthenticated(), require('./clans/get/manage'))
// router.get('/accept_invite', middlewares.isAuthenticated(), require('./clans/get/accept_invite'))
// router.post('/create', middlewares.isAuthenticated(), require('./clans/post/create'))
// router.post('/destroy', middlewares.isAuthenticated(), require('./clans/post/destroy'))
// router.post('/invite', middlewares.isAuthenticated(), require('./clans/post/invite'))
// router.post('/kick', middlewares.isAuthenticated(), require('./clans/post/kick'))
// router.post('/transfer', middlewares.isAuthenticated(), require('./clans/post/transfer'))
// router.post('/update', middlewares.isAuthenticated(), require('./clans/post/update'))
// router.post('/leave', middlewares.isAuthenticated(), require('./clans/post/leave'))
// router.post('/join', middlewares.isAuthenticated(), require('./clans/post/join'))

router.get('*',  (req, res) =>  res.status(503).render('errors/503-known-issue'));

module.exports = router
