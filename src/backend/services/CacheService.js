const NodeCache = require('node-cache')
const cacheService = new NodeCache({
    stdTTL: 300, // use 5 min for all caches if not changed with ttl
    checkperiod: 600, // cleanup memory every 10 min
})

module.exports.CacheService = cacheService
