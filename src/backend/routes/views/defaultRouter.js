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
router.get('/contribution', (reqd, res) => res.render('contribution'))
router.get('/content-creators', (reqd, res) => res.render('content-creators'))
router.get('/play', (reqd, res) => res.render('play'))

// https://github.com/search?q=org%3AFAForever+account_activated&type=code
router.get('/account_activated', (req, res) => res.redirect('/account/register'))

// see: https://github.com/search?q=org%3AFAForever%20password_resetted&type=code
router.get('/password_resetted', (req, res) => res.redirect('/account/requestPasswordReset'))

// this is prob. outdated, but don't know
router.get('/report_submitted', require('./account/get/report'))

module.exports = router
