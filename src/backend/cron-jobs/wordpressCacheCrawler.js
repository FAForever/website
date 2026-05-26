const { scheduleRepeating } = require('./scheduleRepeating')
const { warmAll } = require('./warmAll')
const { CACHE_WARM_INTERVAL_MS } = require('./constants')

const warmupWordpress = (wordpressService) =>
    warmAll('wordpress', [
        ['news', () => wordpressService.getNews(true)],
        ['newshub', () => wordpressService.getNewshub(true)],
        ['contentCreators', () => wordpressService.getContentCreators(true)],
        ['tournamentNews', () => wordpressService.getTournamentNews(true)],
        ['fafTeams', () => wordpressService.getFafTeams(true)],
    ])

/**
 * @param {WordpressService} wordpressService
 * @return {{ stop: () => void }}
 */
module.exports = (wordpressService) =>
    scheduleRepeating(
        'wordpress-cache',
        () => warmupWordpress(wordpressService),
        CACHE_WARM_INTERVAL_MS
    )
