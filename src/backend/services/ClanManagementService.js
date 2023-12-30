class ClanManagementService {
    constructor(userService, clanManagementRepository, clanService) {
        this.userService = userService
        this.clanManagementRepository = clanManagementRepository
        this.clanService = clanService
    }

    async create(tag, name, description) {
        await this.clanManagementRepository.create(tag, name, description)
        try {
            this.clanService
                .getAll(true)
                .then(() => {})
                .catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async update(tag, name, description) {
        await this.clanManagementRepository.update(
            this.userService.getUser().clan.id,
            tag,
            name,
            description
        )
        try {
            this.clanService
                .getAll(true)
                .then(() => {})
                .catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async transferOwnership(newOwnerId) {
        await this.clanManagementRepository.transferOwnership(
            newOwnerId,
            this.userService.getUser().clan.id
        )
        try {
            this.clanService
                .getAll(true)
                .then(() => {})
                .catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async deleteClan() {
        const clanId = parseInt(this.userService.getUser()?.clan.id)
        if (!clanId) {
            throw new Error('User has no clan to destroy')
        }

        await this.clanManagementRepository.deleteClan(clanId)

        // update user and caches, may this should be an event and not directly called here
        try {
            this.clanService
                .getAll(true)
                .then(() => {})
                .catch((e) => console.error(e.stack))
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async createInvite(playerId) {
        return await this.clanManagementRepository.createInvite(
            this.userService.getUser().clan.id,
            playerId
        )
    }

    async acceptInvitation(token) {
        await this.clanManagementRepository.acceptInvitation(token)
        try {
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }

    async kickMember(membershipId) {
        await this.clanManagementRepository.removeClanMembership(membershipId)
    }

    async leaveClan() {
        await this.clanManagementRepository.removeClanMembership(
            this.userService.getUser().clan.membershipId
        )
        try {
            await this.userService.refreshUser()
        } catch (e) {
            console.error(e.stack)
        }
    }
}

module.exports.ClanManagementService = ClanManagementService
