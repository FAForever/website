class ClanManagementService {
    constructor (userService, clanManagementRepository, clanService) {
        this.userService = userService
        this.clanManagementRepository = clanManagementRepository
        this.clanService = clanService
    }

    async create (tag, name, description) {
        await this.clanManagementRepository.create(tag, name, description)
        try {
            this.clanService.getAll(true).then(() => {}).catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async update (tag, name, description) {
        await this.clanManagementRepository.update(this.userService.getUser().clan.id, tag, name, description)
        try {
            this.clanService.getAll(true).then(() => {}).catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async deleteClan () {
        const clanId = parseInt(this.userService.getUser()?.clan.id)
        if (!clanId) {
            throw new Error('User has no clan to destroy')
        }

        await this.clanManagementRepository.deleteClan(clanId)

        // update user and caches, may this should be an event and not directly called here
        try {
            this.clanService.getAll(true).then(() => {}).catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }
}

module.exports.ClanManagementService = ClanManagementService
