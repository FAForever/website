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
router.get('*',  (req, res) =>  res.status(503).render('errors/503-known-issue'));

module.exports = router
