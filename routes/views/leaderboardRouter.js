const express = require('express');
const router = express.Router();
const LeaderboardServiceFactory = require('../../lib/LeaderboardServiceFactory')
const {AcquireTimeoutError} = require('../../lib/MutexService');
const appConfig = require('../../config/app')


const getLeaderboardId = (leaderboardName) => {
    const mapping = {
        'global': 1,
        '1v1': 2,
        '2v2': 3,
        '4v4': 4
    }

    if (leaderboardName in mapping) {
        return mapping[leaderboardName]
    }

    return null
}

router.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    return res.render('leaderboards')
})

router.get('/:leaderboard.json', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(403).json({error: 'Not Authenticated'})
    }

    try {
        const leaderboardId = getLeaderboardId(req.params.leaderboard ?? null);

        if (leaderboardId === null) {
            return res.status(404).json({error: 'Leaderboard "' + req.params.leaderboard + '"does not exist'})
        }

        const token = req.user.data.attributes.token
        const leaderboardService = LeaderboardServiceFactory(appConfig.apiUrl, token)

        return res.json(await leaderboardService.getLeaderboard(leaderboardId))
    } catch (e) {
        if (e instanceof AcquireTimeoutError) {
            return res.status(503).json({error: 'timeout reached'})
        }

        console.error('[error] leaderboardRouter::get:leaderboard.json failed with "' + e.toString() + '"')

        if (!res.headersSent) {
            return res.status(500).json({error: 'unexpected error'})
        }

        throw e
    }
})

module.exports = router
