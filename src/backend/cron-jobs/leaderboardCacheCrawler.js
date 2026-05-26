const { scheduleRepeating } = require('./scheduleRepeating')
const { warmAll } = require('./warmAll')
const { CACHE_WARM_INTERVAL_MS } = require('./constants')

const LEADERBOARDS = [
    ['global', 1],
    ['1v1', 2],
    ['2v2', 3],
    ['4v4', 4],
]

const warmupLeaderboard = (leaderboardService) =>
    warmAll(
        'leaderboard',
        LEADERBOARDS.map(([label, id]) => [
            label,
            () => leaderboardService.getLeaderboard(id, true),
        ])
    )

/**
 * @param {LeaderboardService} leaderboardService
 * @return {{ stop: () => void }}
 */
module.exports = (leaderboardService) =>
    scheduleRepeating(
        'leaderboard-cache',
        () => warmupLeaderboard(leaderboardService),
        CACHE_WARM_INTERVAL_MS
    )
