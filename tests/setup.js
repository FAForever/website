const fs = require('fs')
const { WordpressService } = require('../src/backend/services/WordpressService')
const { LeaderboardService } = require('../src/backend/services/LeaderboardService')
const appConfig = require('../src/backend/config/app')
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

<<<<<<< HEAD
=======
    nock(appConfig.apiUrl)
        .post('/users/buildSteamPasswordResetUrl')
        .reply(200, { steamUrl: 'http://localhost/test-steam-reset' })

>>>>>>> e9a54d1 (lint)
    jest.spyOn(JavaApiM2MClient, 'getToken').mockResolvedValue({
        token: {
            refresh: () => {},
            access_token: 'test'
        }
    })

    nock(appConfig.apiUrl)
        .get('/data/clan?include=leader&fields[clan]=name,tag,description,leader,memberships,createTime&fields[player]=login&page[number]=1&page[size]=3000')
        .reply(200, fs.readFileSync('tests/integration/testData/clan/clans.json', { encoding: 'utf8', flag: 'r' }))

    nock(appConfig.apiUrl)
        .get('/data/clan/2741?include=memberships.player')
        .reply(200, fs.readFileSync('tests/integration/testData/clan/clan.json', { encoding: 'utf8', flag: 'r' }))
    nock(appConfig.apiUrl)
        .post('/users/buildSteamPasswordResetUrl')
        .reply(200, { steamUrl: 'http://localhost/test-steam-reset' })
})

afterEach(() => {
    jest.restoreAllMocks()
})
