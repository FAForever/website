const Scheduler = require('../services/Scheduler')

const successHandler = (name) => {
    console.debug('[debug] Cache updated', { name })
}
const errorHandler = (e, name) => {
    console.error(e.toString(), { name, entrypoint: 'wordpressCacheCrawler.js' })
    console.error(e.stack)
}

const warmupWordpressCache = (wordpressService) => {
    try {
        wordpressService.getNews(true)
            .then(() => successHandler('wordpressService::getNews'))
            .catch((e) => errorHandler(e, 'wordpressService::getNews'))

        wordpressService.getNewshub(true)
            .then(() => successHandler('wordpressService::getNewshub'))
            .catch((e) => errorHandler(e, 'wordpressService::getNewshub'))

        wordpressService.getContentCreators(true)
            .then(() => successHandler('wordpressService::getContentCreators'))
            .catch((e) => errorHandler(e, 'wordpressService::getContentCreators'))

        wordpressService.getTournamentNews(true)
            .then(() => successHandler('wordpressService::getTournamentNews'))
            .catch((e) => errorHandler(e, 'wordpressService::getTournamentNews'))

        wordpressService.getFafTeams(true)
            .then(() => successHandler('wordpressService::getFafTeams'))
            .catch((e) => errorHandler(e, 'wordpressService::getFafTeams'))
    } catch (e) {
        console.error('Error: wordpressCacheCrawler::warmupWordpressCache failed with "' + e.toString() + '"', { entrypoint: 'wordpressCacheCrawler.js' })
        console.error(e.stack)
    }
}

/**
 * @param {WordpressService} wordpressService
 * @return {Scheduler[]}
 */
module.exports = (wordpressService) => {
    warmupWordpressCache(wordpressService)

    const wordpressScheduler = new Scheduler('createWordpressCaches',
        () => warmupWordpressCache(wordpressService), 60 * 59 * 1000)
    wordpressScheduler.start()

    return wordpressScheduler
}
