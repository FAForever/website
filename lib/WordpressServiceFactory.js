const WordpressService = require("./WordpressService")
const WordpressRepository = require("./WordpressRepository")
const {Axios} = require("axios")
const cacheService = require('./CacheService')

module.exports = (wordpressBaseURL) => {
    const config = {
        baseURL: wordpressBaseURL
    };
    const wordpressClient = new Axios(config)

    return new WordpressService(cacheService, new WordpressRepository(wordpressClient))
}
