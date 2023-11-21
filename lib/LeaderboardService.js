const leaderboardTTL = 60 * 60  // 1 hours ttl as a relaxation for https://github.com/FAForever/website/issues/482

class LeaderboardService {
    constructor(cacheService, mutexService, leaderboardRepository, lockTimeout = 3000) {
        this.lockTimeout = lockTimeout
        this.cacheService = cacheService
        this.mutexService = mutexService
        this.leaderboardRepository = leaderboardRepository
    }

    async getLeaderboard(id) {

        if (typeof (id) !== 'number') {
            throw new Error('LeaderboardService:getLeaderboard id must be a number')
        }

        const cacheKey = 'leaderboard-' + id

        if (this.cacheService.has(cacheKey)) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexService.locked) {
            await this.mutexService.acquire(() => {
            }, this.lockTimeout)
            return this.getLeaderboard(id)
        }

        await this.mutexService.acquire(async () => {
            const result = await this.leaderboardRepository.fetchLeaderboard(id)
            this.cacheService.set(cacheKey, result, leaderboardTTL);
        })

        return this.getLeaderboard(id)
    }
}

module.exports = LeaderboardService
