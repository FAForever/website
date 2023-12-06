const NodeCache = require('node-cache')

const createCacheService = (stdTTL, checkperiod) => {
    return new NodeCache({
        stdTTL: stdTTL || 300,
        checkperiod: checkperiod || 600
    })
}

module.exports = {
    CacheService: createCacheService()
}
