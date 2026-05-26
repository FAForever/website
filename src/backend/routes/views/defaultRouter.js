const express = require('../../ExpressApp')
const router = express.Router()

router.get('/', (req, res) => res.render('index'))
router.get('/newshub', (req, res) => res.render('newshub'))
router.get('/campaign-missions', (req, res) => res.render('campaign-missions'))
router.get('/scfa-vs-faf', (req, res) => res.render('scfa-vs-faf'))
router.get('/ai', (req, res) => res.render('ai'))
router.get('/donation', (req, res) => res.render('donation'))
router.get('/tutorials-guides', (req, res) => res.render('tutorials-guides'))
router.get('/faf-teams', (req, res) => res.render('faf-teams'))
router.get('/contribution', (req, res) => res.render('contribution'))
router.get('/content-creators', (req, res) => res.render('content-creators'))
router.get('/play', (req, res) => res.render('play'))
// redirect for the game-client https://github.com/FAForever/website/issues/459
router.get('/clan/:id', (req, res) => {
    res.redirect('/clans/view/' + req.params.id)
})

// this is prob. outdated, but don't know
router.get('/report_submitted', require('./account/get/report'))

module.exports = router
