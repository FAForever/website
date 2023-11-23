const ClanService = require("./ClanService")
const ClanRepository = require("./ClanRepository")
const {Axios} = require("axios")
const cacheService = require('../CacheService')

module.exports = (javaApiBaseURL, token) => {
    const config = {
        baseURL: javaApiBaseURL,
        headers: {Authorization: `Bearer ${token}`}
    };
    const clanClient = new Axios(config)

    return new ClanService(cacheService, new ClanRepository(clanClient))
}
