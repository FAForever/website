const create = require('../views/clans/create')
const express = require('../../ExpressApp')
const router = express.Router()
const middlewares = require('../middleware')

// This will be replaced soon, therefor I did not spend time on it
router.get('/', (req, res) => res.render('clans/clans'))
router.get('/view/:id', async (req, res) => {
    const clanId = parseInt(req.params.id || null)
    if (!clanId) {
        return res.redirect('/clans')
    }

    return res.render('clans/clan', { clan: await req.appContainer.get('ClanService').getClan(clanId) })
})

router.get('/create', create)
router.post('/create', create)
router.get('/manage', middlewares.isAuthenticated(), require('./clans/get/manage'))
router.post('/update', middlewares.isAuthenticated(), require('./clans/post/update'))
router.post('/destroy', middlewares.isAuthenticated(), require('./clans/post/destroy'))

router.get('*', (req, res) => res.status(503).render('errors/503-known-issue'))

module.exports = router
