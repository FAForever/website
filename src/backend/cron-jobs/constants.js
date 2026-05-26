// Intentionally undercuts the 60-minute service cache TTL so caches
// are refreshed before they can expire.
module.exports.CACHE_WARM_INTERVAL_MS = 59 * 60 * 1000
