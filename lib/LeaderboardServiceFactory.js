const LeaderboardService = require("./LeaderboardService");
const LeaderboardRepository = require("./LeaderboardRepository");
const {MutexService} = require("./MutexService");
const NodeCache = require("node-cache");
const {Axios} = require("axios");

const leaderboardMutex = new MutexService()
const cacheService = new NodeCache(
    {
        stdTTL: 300, // use 5 min for all caches if not changed with ttl
        checkperiod: 600 // cleanup memory every 10 min
    }
);

module.exports = (javaApiBaseURL, token) => {
    const config = {
        baseURL: javaApiBaseURL,
        headers: {Authorization: `Bearer ${token}`}
    };
    const javaApiClient = new Axios(config)

    return new LeaderboardService(cacheService, leaderboardMutex, new LeaderboardRepository(javaApiClient))
}
