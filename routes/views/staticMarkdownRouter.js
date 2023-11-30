const express = require('../../ExpressApp')
const showdown = require('showdown')
const fs = require('fs')
const router = express.Router()

function markdown(template) {
    return (req, res) => {
        res.render('markdown', {
            content: new showdown.Converter().makeHtml(fs.readFileSync(template, 'utf-8'))
        })
    }
}

router.get('/privacy', markdown('templates/views/markdown/privacy.md'))
router.get('/privacy-fr', markdown('templates/views/markdown/privacy-fr.md'))
router.get('/privacy-ru', markdown('templates/views/markdown/privacy-ru.md'))
router.get('/tos', markdown('templates/views/markdown/tos.md'))
router.get('/tos-fr', markdown('templates/views/markdown/tos-fr.md'))
router.get('/tos-ru', markdown('templates/views/markdown/tos-ru.md'))
router.get('/rules', markdown('templates/views/markdown/rules.md'))
router.get('/cg', markdown('templates/views/markdown/cg.md'))

module.exports = router
