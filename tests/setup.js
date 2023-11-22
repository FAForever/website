const fs = require("fs");
const wordpressService = require("../lib/WordpressService");
const leaderboardService = require("../lib/LeaderboardService");
beforeEach(() => {
    const newsFile = JSON.parse(fs.readFileSync('tests/integration/testData/news.json',{encoding:'utf8', flag:'r'}))
    jest.spyOn(wordpressService.prototype, 'getNews').mockResolvedValue(newsFile);

    const tnFile = JSON.parse(fs.readFileSync('tests/integration/testData/tournament-news.json',{encoding:'utf8', flag:'r'}))
    jest.spyOn(wordpressService.prototype, 'getTournamentNews').mockResolvedValue(tnFile);

    const ccFile = JSON.parse(fs.readFileSync('tests/integration/testData/content-creators.json',{encoding:'utf8', flag:'r'}))
    jest.spyOn(wordpressService.prototype, 'getContentCreators').mockResolvedValue(ccFile);

    const ftFile = JSON.parse(fs.readFileSync('tests/integration/testData/faf-teams.json',{encoding:'utf8', flag:'r'}))
    jest.spyOn(wordpressService.prototype, 'getFafTeams').mockResolvedValue(ftFile);

    const nhFile = JSON.parse(fs.readFileSync('tests/integration/testData/newshub.json',{encoding:'utf8', flag:'r'}))
    jest.spyOn(wordpressService.prototype, 'getNewshub').mockResolvedValue(nhFile);
    
    jest.spyOn(leaderboardService.prototype, 'getLeaderboard').mockImplementation((id) => {
        const mapping = {
            1: 'global',
            2: '1v1',
            3: '2v2',
            4: '4v4',
        }

        if (id in mapping) {
            return JSON.parse(fs.readFileSync('tests/integration/testData/leaderboard/' + mapping[id] + '.json',{encoding:'utf8', flag:'r'}))
        }
        
        throw new Error('do we need to change the mock?')
    })
})

afterEach(() => {
    jest.restoreAllMocks()
})
