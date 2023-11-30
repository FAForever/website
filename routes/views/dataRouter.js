const express = require('../../ExpressApp')
const router = express.Router();
const {AcquireTimeoutError} = require('../../lib/MutexService');

const getData = async (req, res, name, data) => {
    try {
        return res.json(data)
    } catch (e) {
        if (e instanceof AcquireTimeoutError) {
            return res.status(503).json({error: 'timeout reached'})
        }

        console.error('[error] dataRouter::get:' + name + '.json failed with "' + e.toString() + '"')

        if (!res.headersSent) {
            return res.status(500).json({error: 'unexpected error'})
        }
        throw e
    }
}
router.get('/newshub.json', async (req, res) => {
    getData(req, res, 'newshub', await req.services.wordpressService.getNewshub())
})

router.get('/tournament-news.json', async (req, res) => {
    getData(req, res, 'tournament-news', await req.services.wordpressService.getTournamentNews())
})
router.get('/faf-teams.json', async (req, res) => {
    getData(req, res, 'faf-teams', await req.services.wordpressService.getFafTeams())
})

router.get('/content-creators.json', async (req, res) => {
    getData(req, res, 'content-creators', await req.services.wordpressService.getContentCreators())
})



module.exports = router
