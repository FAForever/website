class UserRepository {
    constructor (javaApiClient) {
        this.javaApiClient = javaApiClient
    }

    fetchUser (oAuthPassport) {
        return this.javaApiClient.get('/me').then(response => {
            const rawUser = JSON.parse(response.data).data

            let clan = null

            if (rawUser.attributes.clan) {
                clan = {
                    id: parseInt(rawUser.attributes.clan.id),
                    membershipId: parseInt(rawUser.attributes.clan.membershipId),
                    tag: rawUser.attributes.clan.tag,
                    name: rawUser.attributes.clan.name
                }
            }

            return {
                id: parseInt(rawUser.attributes.userId),
                name: rawUser.attributes.userName,
                email: rawUser.attributes.email,
                clan,
                oAuthPassport
            }
        })
    }
}

module.exports.UserRepository = UserRepository
