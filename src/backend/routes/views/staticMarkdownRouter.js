const express = require('../../ExpressApp')
const showdown = require('showdown')
const fs = require('fs')
const router = express.Router()

function markdown(template, containerClass = "") {
    return (req, res) => {
        res.render('markdown', {
            content: new showdown.Converter().makeHtml(
                fs.readFileSync(template, 'utf-8')
            ),
            containerClass: containerClass
        })
    }
}

router.get(
    '/privacy',
    markdown('src/backend/templates/views/markdown/privacy.md')
)
router.get(
    '/privacy-fr',
    markdown('src/backend/templates/views/markdown/privacy-fr.md')
)
router.get(
    '/privacy-ru',
    markdown('src/backend/templates/views/markdown/privacy-ru.md')
)
router.get('/tos', markdown('src/backend/templates/views/markdown/tos.md'))
router.get(
    '/tos-fr',
    markdown('src/backend/templates/views/markdown/tos-fr.md')
)
router.get(
    '/tos-ru',
    markdown('src/backend/templates/views/markdown/tos-ru.md')
)
router.get('/rules', markdown('src/backend/templates/views/markdown/rules.md'))
router.get('/cg', markdown('src/backend/templates/views/markdown/cg.md'))

// Under-review, these routes will include a containerClass that gives them the new styling.
router.get(
    '/privacy-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/privacy.md', 'under-review')
)
router.get(
    '/privacy-fr-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/privacy-fr.md', 'under-review')
)
router.get(
    '/privacy-ru-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/privacy-ru.md', 'under-review')
)
router.get(
    '/tos-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/tos.md', 'under-review')
)
router.get(
    '/tos-fr-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/tos-fr.md', 'under-review')
)
router.get(
    '/tos-ru-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/tos-ru.md', 'under-review')
)
router.get(
    '/rules-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/rules-new.md', 'under-review')
)
router.get(
    '/cg-under-review-not-valid',
    markdown('src/backend/templates/views/markdown/cg.md', 'under-review')
)


module.exports = router
