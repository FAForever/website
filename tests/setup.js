const fs = require('fs')
const { WordpressService } = require('../src/backend/services/WordpressService')
const { LeaderboardService } = require('../src/backend/services/LeaderboardService')
const nock = require('nock')
nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')
beforeEach(() => {
    const newsFile = JSON.parse(fs.readFileSync('tests/integration/testData/news.json', { encoding: 'utf8', flag: 'r' }))
    jest.spyOn(WordpressService.prototype, 'getNews').mockResolvedValue(newsFile)

    const tnFile = JSON.parse(fs.readFileSync('tests/integration/testData/tournament-news.json', { encoding: 'utf8', flag: 'r' }))
    jest.spyOn(WordpressService.prototype, 'getTournamentNews').mockResolvedValue(tnFile)

    const ccFile = JSON.parse(fs.readFileSync('tests/integration/testData/content-creators.json', { encoding: 'utf8', flag: 'r' }))
    jest.spyOn(WordpressService.prototype, 'getContentCreators').mockResolvedValue(ccFile)

    const ftFile = JSON.parse(fs.readFileSync('tests/integration/testData/faf-teams.json', { encoding: 'utf8', flag: 'r' }))
    jest.spyOn(WordpressService.prototype, 'getFafTeams').mockResolvedValue(ftFile)

    const nhFile = JSON.parse(fs.readFileSync('tests/integration/testData/newshub.json', { encoding: 'utf8', flag: 'r' }))
    jest.spyOn(WordpressService.prototype, 'getNewshub').mockResolvedValue(nhFile)

    jest.spyOn(LeaderboardService.prototype, 'getLeaderboard').mockImplementation((id) => {
        const mapping = {
            1: 'global',
            2: '1v1',
            3: '2v2',
            4: '4v4'
        }

        if (id in mapping) {
            return JSON.parse(fs.readFileSync('tests/integration/testData/leaderboard/' + mapping[id] + '.json', { encoding: 'utf8', flag: 'r' }))
        }

        throw new Error('do we need to change the mock?')
    })
})

afterEach(() => {
    jest.restoreAllMocks()
})
