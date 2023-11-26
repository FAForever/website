class UserRepository {
    constructor(javaApiClient) {
        this.javaApiClient = javaApiClient
    }
    async fetchUser(oAuthPassport) {
        const response = await this.javaApiClient.get('/me')
        const rawUser = JSON.parse(response.data).data

        let clan = null
        
        if (rawUser.attributes.clan) {
            clan = {
                id: rawUser.attributes.clan.id,
                membershipId: rawUser.attributes.clan.membershipId,
                tag: rawUser.attributes.clan.tag,
                name: rawUser.attributes.clan.name,
            }
        }
        
        return  {
            id: rawUser.id,
            name: rawUser.attributes.userName,
            email: rawUser.attributes.email,
            clan: clan,
            oAuthPassport: oAuthPassport
        }
    }
}

module.exports = UserRepository
