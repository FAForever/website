const { scheduleRepeating } = require('./scheduleRepeating')
const { warmAll } = require('./warmAll')
const { CACHE_WARM_INTERVAL_MS } = require('./constants')

const warmupClans = (clanService) =>
    warmAll('clan', [['all', () => clanService.getAll(true)]])

/**
 * @param {ClanService} clanService
 * @return {{ stop: () => void }}
 */
module.exports = (clanService) =>
    scheduleRepeating(
        'clan-cache',
        () => warmupClans(clanService),
        CACHE_WARM_INTERVAL_MS
    )
