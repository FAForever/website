const express = require('../../ExpressApp')
const router = express.Router();

function getNewsArticleBySlug(articles, slug) {
    let [newsArticle] = articles.filter((entry) => {
        if (entry.slug === slug) {
            return entry
        }
    }) ?? []
    
    return newsArticle ?? null
}

function getNewsArticleByDeprecatedSlug(articles, slug) {
    let [newsArticle] = articles.filter((entry) => {
        if (entry.bcSlug === slug) {
            return entry
        }
    }) ?? []

    return newsArticle ?? null
}

router.get(`/`, async (req, res) => {
    res.render('news', {news: await req.services.wordpressService.getNews()})
})

router.get(`/:slug`, async (req, res) => {
    const newsArticles = await req.services.wordpressService.getNews()

    const newsArticle = getNewsArticleBySlug(newsArticles, req.params.slug)

    if (newsArticle === null) {
        const newsArticleByOldSlug = getNewsArticleByDeprecatedSlug(newsArticles, req.params.slug)

        if (newsArticleByOldSlug) {
            // old slug style, here for backward compatibility 
            res.redirect(301, newsArticleByOldSlug.slug)

            return
        }

        res.redirect(req.baseUrl)

        return
    }

    res.render('newsArticle', {
        newsArticle: newsArticle
    });
})

module.exports = router
