const express = require('express');
const router = express.Router();
const {AcquireTimeoutError} = require('../../lib/MutexService');
const middlewares = require('../middleware')
const {AuthFailed} = require('../../lib/ApiErrors')


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

router.get('/', middlewares.isAuthenticated(), (req, res) => {
    return res.render('leaderboards')
})

router.get('/:leaderboard.json', middlewares.isAuthenticated(null, true), async (req, res) => {
    try {
        const leaderboardId = getLeaderboardId(req.params.leaderboard ?? null);

        if (leaderboardId === null) {
            return res.status(404).json({error: 'Leaderboard "' + req.params.leaderboard + '" does not exist'})
        }

        return res.json(await req.services.leaderboardService.getLeaderboard(leaderboardId))
    } catch (e) {
        if (e instanceof AcquireTimeoutError) {
            return res.status(503).json({error: 'timeout reached'})
        }
        
        if (e instanceof AuthFailed) {
            req.logout(function(err) {
                if (err) {
                    throw err
                }
            })
            
            return res.status(400).json({error: 'authentication failed, reload site'})
        }

        console.error('[error] leaderboardRouter::get:leaderboard.json failed with "' + e.toString() + '"')

        if (!res.headersSent) {
            return res.status(500).json({error: 'unexpected error'})
        }

        throw e
    }
})

module.exports = router
