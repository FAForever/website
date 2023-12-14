const express = require('../../ExpressApp')
const router = express.Router()
const { AcquireTimeoutError } = require('../../services/MutexService')

const getLeaderboardId = (leaderboardName) => {
    const mapping = {
        global: 1,
        '1v1': 2,
        '2v2': 3,
        '4v4': 4,
    }

    if (leaderboardName in mapping) {
        return mapping[leaderboardName]
    }

    return null
}

router.get('/', (req, res) => {
    return res.render('leaderboards')
})

router.get('/:leaderboard.json', async (req, res) => {
    try {
        const leaderboardId = getLeaderboardId(req.params.leaderboard ?? null)

        if (leaderboardId === null) {
            return res.status(404).json({
                error:
                    'Leaderboard "' +
                    req.params.leaderboard +
                    '" does not exist',
            })
        }

        return res.json(
            await req.appContainer
                .get('LeaderboardService')
                .getLeaderboard(leaderboardId)
        )
    } catch (e) {
        if (e instanceof AcquireTimeoutError) {
            return res.status(503).json({ error: 'timeout reached' })
        }

        console.error(
            '[error] leaderboardRouter::get:leaderboard.json failed with "' +
                e.toString() +
                '"',
            e.stack
        )

        if (!res.headersSent) {
            return res.status(500).json({ error: 'unexpected error' })
        }

        throw e
    }
})

module.exports = router
