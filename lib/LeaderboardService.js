class LeaderboardService {
    constructor(cacheService, lockService, leaderboardRepository, lockTimeout = 3000) {
        this.lockTimeout = lockTimeout
        this.cacheService = cacheService
        this.lockService = lockService
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

        if (this.lockService.locked) {
            await this.lockService.lock(() => {
            }, this.lockTimeout)
            return this.getLeaderboard(id)
        }

        await this.lockService.lock(async () => {
            const result = await this.leaderboardRepository.fetchLeaderboard(id)
            this.cacheService.set(cacheKey, result);
        })

        return this.getLeaderboard(id)
    }
}

module.exports = LeaderboardService
