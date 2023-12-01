const { MutexService } = require('./MutexService')
const wordpressTTL = 60 * 60

class WordpressService {
    constructor (cacheService, wordpressRepository, lockTimeout = 3000) {
        this.lockTimeout = lockTimeout
        this.cacheService = cacheService
        this.mutexServices = {
            news: new MutexService(),
            tournament: new MutexService(),
            creators: new MutexService(),
            teams: new MutexService(),
            newshub: new MutexService()
        }
        this.wordpressRepository = wordpressRepository
    }

    getCacheKey (name) {
        return 'WordpressService_' + name
    }

    async getNews (ignoreCache = false) {
        const cacheKey = this.getCacheKey('news')

        if (this.cacheService.has(cacheKey) && ignoreCache === false) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexServices.news.locked) {
            await this.mutexServices.news.acquire(() => {
            }, this.lockTimeout)
            return this.getNews()
        }

        await this.mutexServices.news.acquire(async () => {
            const result = await this.wordpressRepository.fetchNews()
            this.cacheService.set(cacheKey, result, wordpressTTL)
        })

        return this.getNews()
    }

    async getTournamentNews (ignoreCache = false) {
        const cacheKey = this.getCacheKey('tournament-news')

        if (this.cacheService.has(cacheKey) && ignoreCache === false) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexServices.tournament.locked) {
            await this.mutexService.acquire(() => {
            }, this.lockTimeout)
            return this.getTournamentNews()
        }

        await this.mutexServices.tournament.acquire(async () => {
            const result = await this.wordpressRepository.fetchTournamentNews()
            this.cacheService.set(cacheKey, result, wordpressTTL)
        })

        return this.getTournamentNews()
    }

    async getContentCreators (ignoreCache = false) {
        const cacheKey = this.getCacheKey('content-creators')

        if (this.cacheService.has(cacheKey) && ignoreCache === false) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexServices.creators.locked) {
            await this.mutexServices.creators.acquire(() => {
            }, this.lockTimeout)
            return this.getContentCreators()
        }

        await this.mutexServices.creators.acquire(async () => {
            const result = await this.wordpressRepository.fetchContentCreators()
            this.cacheService.set(cacheKey, result, wordpressTTL)
        })

        return this.getContentCreators()
    }

    async getFafTeams (ignoreCache = false) {
        const cacheKey = this.getCacheKey('faf-teams')

        if (this.cacheService.has(cacheKey) && ignoreCache === false) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexServices.teams.locked) {
            await this.mutexService.acquire(() => {
            }, this.lockTimeout)
            return this.getFafTeams()
        }

        await this.mutexServices.teams.acquire(async () => {
            const result = await this.wordpressRepository.fetchFafTeams()
            this.cacheService.set(cacheKey, result, wordpressTTL)
        })

        return this.getFafTeams()
    }

    async getNewshub (ignoreCache = false) {
        const cacheKey = this.getCacheKey('newshub')

        if (this.cacheService.has(cacheKey) && ignoreCache === false) {
            return this.cacheService.get(cacheKey)
        }

        if (this.mutexServices.newshub.locked) {
            await this.mutexService.acquire(() => {
            }, this.lockTimeout)
            return this.getNewshub()
        }

        await this.mutexServices.newshub.acquire(async () => {
            const result = await this.wordpressRepository.fetchNewshub()
            this.cacheService.set(cacheKey, result, wordpressTTL)
        })

        return this.getNewshub()
    }
}

module.exports.WordpressService = WordpressService
