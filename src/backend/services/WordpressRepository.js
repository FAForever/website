const { convert } = require('url-slug')

class WordpressRepository {
    constructor(wordpressClient) {
        this.wordpressClient = wordpressClient
    }

    async fetchNews() {
        const response = await this.wordpressClient.get(
            '/wp-json/wp/v2/posts/?per_page=100&_embed&_fields=_links.author,_links.wp:featuredmedia,_embedded,title,content.rendered,date,categories&categories=587'
        )

        if (response.status !== 200) {
            throw new Error(
                'WordpressRepository::fetchNews failed with response status "' +
                    response.status +
                    '"'
            )
        }

        const rawNewsData = JSON.parse(response.data)

        if (typeof rawNewsData !== 'object' || rawNewsData === null) {
            throw new Error(
                'WordpressRepository::mapNewsResponse malformed response, not an object'
            )
        }

        return rawNewsData.map((item) => ({
            slug: convert(item.title.rendered),
            bcSlug: item.title.rendered.replace(/ /g, '-'),
            date: item.date,
            title: item.title.rendered,
            content: item.content.rendered,
            author: item._embedded.author[0].name,
            media: item._embedded['wp:featuredmedia'][0].source_url,
        }))
    }

    async fetchTournamentNews() {
        const response = await this.wordpressClient.get(
            '/wp-json/wp/v2/posts/?per_page=10&_embed&_fields=content.rendered,categories&categories=638'
        )

        if (response.status !== 200) {
            throw new Error(
                'WordpressRepository::fetchTournamentNews failed with response status "' +
                    response.status +
                    '"'
            )
        }

        const dataObjectToArray = JSON.parse(response.data)

        const sortedData = dataObjectToArray.map((item) => ({
            content: item.content.rendered,
            category: item.categories,
        }))

        return sortedData.filter((article) => article.category[1] !== 284)
    }

    async fetchContentCreators() {
        const response = await this.wordpressClient.get(
            '/wp-json/wp/v2/posts/?per_page=100&_embed&_fields=content.rendered,categories&categories=639'
        )

        if (response.status !== 200) {
            throw new Error(
                'WordpressRepository::fetchContentCreators failed with response status "' +
                    response.status +
                    '"'
            )
        }

        const items = JSON.parse(response.data)

        return items.map((item) => ({
            content: item.content.rendered,
        }))
    }

    async fetchFafTeams() {
        const response = await this.wordpressClient.get(
            '/wp-json/wp/v2/posts/?per_page=100&_embed&_fields=content.rendered,categories&categories=636'
        )

        if (response.status !== 200) {
            throw new Error(
                'WordpressRepository::fetchFafTeams failed with response status "' +
                    response.status +
                    '"'
            )
        }

        const items = JSON.parse(response.data)

        return items.map((item) => ({
            content: item.content.rendered,
        }))
    }

    async fetchNewshub() {
        const response = await this.wordpressClient.get(
            '/wp-json/wp/v2/posts/?per_page=10&_embed&_fields=_links.author,_links.wp:featuredmedia,_embedded,title,newshub_externalLinkUrl,newshub_sortIndex,content.rendered,date,categories&categories=283'
        )

        if (response.status !== 200) {
            throw new Error(
                'WordpressRepository::fetchNewshub failed with response status "' +
                    response.status +
                    '"'
            )
        }

        const items = JSON.parse(response.data)
        const sortedData = items.map((item) => ({
            category: item.categories,
            sortIndex: item.newshub_sortIndex,
            link: item.newshub_externalLinkUrl,
            date: item.date,
            title: item.title.rendered,
            content: item.content.rendered,
            author: item._embedded.author[0].name,
            media: item._embedded['wp:featuredmedia'][0].source_url,
        }))

        sortedData.sort(
            (articleA, articleB) => articleB.sortIndex - articleA.sortIndex
        )

        return sortedData.filter((article) => {
            return article.category[1] !== 284
        })
    }
}

module.exports.WordpressRepository = WordpressRepository
