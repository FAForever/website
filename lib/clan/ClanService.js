const {MutexService} = require("../MutexService");
const clanTTL = 60 * 5 

class ClanService {
    constructor(cacheService, clanRepository, userService, lockTimeout = 3000) {
        this.lockTimeout = lockTimeout
        this.cacheService = cacheService
        this.mutexService = new MutexService()
        this.clanRepository = clanRepository
        this.userService = userService
    }

    getCacheKey(name) {
        return 'ClanService_' + name
    }
    
    async getClan(id) {
        return this.clanRepository.fetchClan(id)
    }

    async getAll() {

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
            const result = await this.clanRepository.fetchAll() 
            this.cacheService.set(cacheKey, result, clanTTL);
        })

        return this.getAll()
    }
    
    async createClan() {
        await this.clanRepository.createClan()
        await this.userService.refreshUser()
    }
    
    async deleteClan(clanId) {
        await this.clanRepository.deleteClan(clanId)
        await this.userService.refreshUser()
    }
    
    async getClanMembership(clanMembershipId) {
        return this.clanRepository.fetchClanMembership(clanMembershipId)
    }
}

module.exports = ClanService
