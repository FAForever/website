const LeaderboardService = require("./LeaderboardService");
const LeaderboardRepository = require("./LeaderboardRepository");
const {Axios} = require("axios");
const cacheService = require('./CacheService')

module.exports = (javaApiBaseURL, token) => {
    const config = {
        baseURL: javaApiBaseURL,
        headers: {Authorization: `Bearer ${token}`}
    };
    const javaApiClient = new Axios(config)

    return new LeaderboardService(cacheService, new LeaderboardRepository(javaApiClient))
}
