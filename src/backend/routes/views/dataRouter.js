const express = require('../../ExpressApp')
const router = express.Router()
const { AcquireTimeoutError } = require('../../services/MutexService')

const getData = async (req, res, name, data) => {
    try {
        return res.json(data)
    } catch (e) {
        if (e instanceof AcquireTimeoutError) {
            return res.status(503).json({ error: 'timeout reached' })
        }

        console.error('[error] dataRouter::get:' + name + '.json failed with "' + e.toString() + '"')

        if (!res.headersSent) {
            return res.status(500).json({ error: 'unexpected error' })
        }
        throw e
    }
}
router.get('/newshub.json', async (req, res) => {
    getData(req, res, 'newshub', await req.appContainer.get('WordpressService').getNewshub())
})

router.get('/tournament-news.json', async (req, res) => {
    getData(req, res, 'tournament-news', await req.appContainer.get('WordpressService').getTournamentNews())
})
router.get('/faf-teams.json', async (req, res) => {
    getData(req, res, 'faf-teams', await req.appContainer.get('WordpressService').getFafTeams())
})

router.get('/content-creators.json', async (req, res) => {
    getData(req, res, 'content-creators', await req.appContainer.get('WordpressService').getContentCreators())
})

router.get('/recent-players.json', async (req, res) => {
    const rawData = await req.appContainer.get('LeaderboardService').getLeaderboard(1)
    const data = rawData.map((item) => ({
        id: item.playerId,
        name: item.label
    }))

    getData(req, res, 'content-creators', data)
})

router.get('/clans.json', async (req, res) => {
    try {
        return res.json(await req.appContainer.get('ClanService').getAll())
    } catch (e) {
        if (e instanceof AcquireTimeoutError) {
            return res.status(503).json({ error: 'timeout reached' })
        }

        console.error('[error] dataRouter::get:clans.json failed with "' + e.toString() + '"')

        if (!res.headersSent) {
            return res.status(500).json({ error: 'unexpected error' })
        }

        throw e
    }
})

module.exports = router
