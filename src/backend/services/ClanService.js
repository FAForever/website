const { MutexService } = require('./MutexService')
const clanTTL = 60 * 5

class ClanService {
    constructor (cacheService, dataRepository, lockTimeout = 3000) {
        this.lockTimeout = lockTimeout
        this.cacheService = cacheService
        this.mutexService = new MutexService()
        this.dataRepository = dataRepository
    }

    getCacheKey (name) {
        return 'ClanService_' + name
    }

    async getClan (id, ignoreCache = false) {
        return await this.dataRepository.fetchClan(id)
    }

    async getAll () {
        const cacheKey = this.getCacheKey('all')

        if (this.cacheService.has(cacheKey)) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexService.locked) {
            await this.mutexService.acquire(() => {
            }, this.lockTimeout)
            return this.getAll()
        }

        await this.mutexService.acquire(async () => {
            const result = await this.dataRepository.fetchAllClans()
            this.cacheService.set(cacheKey, result, clanTTL)
        })

        return this.getAll()
    }
}

module.exports.ClanService = ClanService
