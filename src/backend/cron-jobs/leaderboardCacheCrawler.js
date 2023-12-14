const Scheduler = require('../services/Scheduler')

const successHandler = (name) => {
    console.debug('[debug] Cache updated', { name })
}
const errorHandler = (e, name) => {
    console.error(e.toString(), {
        name,
        entrypoint: 'leaderboardCacheCrawler.js',
    })
    console.error(e.stack)
}

const warmupLeaderboard = async (leaderboardService) => {
    try {
        await leaderboardService
            .getLeaderboard(1, true)
            .then(() =>
                successHandler('leaderboardService::getLeaderboard(global)')
            )
            .catch((e) =>
                errorHandler(e, 'leaderboardService::getLeaderboard(global)')
            )

        await leaderboardService
            .getLeaderboard(2, true)
            .then(() =>
                successHandler('leaderboardService::getLeaderboard(1v1)')
            )
            .catch((e) =>
                errorHandler(e, 'leaderboardService::getLeaderboard(1v1)')
            )

        await leaderboardService
            .getLeaderboard(3, true)
            .then(() =>
                successHandler('leaderboardService::getLeaderboard(2v2)')
            )
            .catch((e) =>
                errorHandler(e, 'leaderboardService::getLeaderboard(2v2)')
            )

        await leaderboardService
            .getLeaderboard(4, true)
            .then(() =>
                successHandler('leaderboardService::getLeaderboard(4v4)')
            )
            .catch((e) =>
                errorHandler(e, 'leaderboardService::getLeaderboard(4v4)')
            )
    } catch (e) {
        console.error(
            'Error: leaderboardCacheCrawler::warmupLeaderboard failed with "' +
                e.toString() +
                '"',
            { entrypoint: 'leaderboardCacheCrawler.js' }
        )
        console.error(e.stack)
    }
}

/**
 * @param {LeaderboardService} leaderboardService
 * @return {Scheduler[]}
 */
module.exports = (leaderboardService) => {
    warmupLeaderboard(leaderboardService).then(() => {})

    const leaderboardScheduler = new Scheduler(
        'createLeaderboardCaches',
        () => warmupLeaderboard(leaderboardService).then(() => {}),
        60 * 59 * 1000
    )
    leaderboardScheduler.start()

    return leaderboardScheduler
}
