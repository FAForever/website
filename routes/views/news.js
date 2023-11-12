const express = require('express');
const router = express.Router();
const fs = require('fs')

function getNewsArticles() {
    const readFile = fs.readFileSync('./public/js/app/members/news.json',
        {encoding:'utf8', flag:'r'});
    return JSON.parse(readFile);
}

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

router.get(`/`, (req, res) => {
    res.render('news', {news: getNewsArticles()});
})

router.get(`/:slug`, (req, res) => {
    const newsArticles = getNewsArticles();
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
