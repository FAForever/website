const express = require('../../ExpressApp')
const router = express.Router()

function getNewsArticleBySlug(articles, slug) {
    const [newsArticle] =
        articles.filter((entry) => {
            return entry.slug === slug
        }) ?? []

    return newsArticle ?? null
}

function getNewsArticleByDeprecatedSlug(articles, slug) {
    const [newsArticle] =
        articles.filter((entry) => {
            return entry.bcSlug === slug
        }) ?? []

    return newsArticle ?? null
}

router.get('/', async (req, res) => {
    res.render('news', {
        news: await req.appContainer.get('WordpressService').getNews(),
    })
})

router.get('/:slug', async (req, res) => {
    const newsArticles = await req.appContainer
        .get('WordpressService')
        .getNews()

    const newsArticle = getNewsArticleBySlug(newsArticles, req.params.slug)

    if (newsArticle === null) {
        const newsArticleByOldSlug = getNewsArticleByDeprecatedSlug(
            newsArticles,
            req.params.slug
        )

        if (newsArticleByOldSlug) {
            // old slug style, here for backward compatibility
            res.redirect(301, newsArticleByOldSlug.slug)

            return
        }

        res.redirect(req.baseUrl)

        return
    }

    res.render('newsArticle', {
        newsArticle,
    })
})

module.exports = router
