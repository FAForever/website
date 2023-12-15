const { JavaApiError, GenericJavaApiError } = require('./ApiErrors')

class ClanManagementRepository {
    constructor(javaApiClient) {
        this.javaApiClient = javaApiClient
    }

    async create(tag, name, description) {
        try {
            const response = await this.javaApiClient.post(
                '/clans/create' +
                    '?name=' +
                    encodeURIComponent(name) +
                    '&tag=' +
                    encodeURIComponent(tag) +
                    '&description=' +
                    encodeURIComponent(description)
            )

            if (response.status !== 200) {
                throw new JavaApiError(
                    response.status,
                    response.config.url,
                    JSON.parse(response.data) || []
                )
            }
        } catch (e) {
            if (e instanceof JavaApiError) {
                throw e
            }

            throw new GenericJavaApiError(e.toString())
        }
    }

    async deleteClan(clanId) {
        const response = await this.javaApiClient.delete('/data/clan/' + clanId)

        if (response.status !== 204) {
            throw new JavaApiError(
                response.status,
                response.config.url,
                JSON.parse(response.data) || []
            )
        }
    }

    async update(id, tag, name, description) {
        const newClanObject = {
            data: {
                type: 'clan',
                id,
                attributes: {
                    description,
                    name,
                    tag,
                },
            },
        }

        try {
            const response = await this.javaApiClient.patch(
                `/data/clan/${id}`,
                JSON.stringify(newClanObject),
                {
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        Accept: 'application/vnd.api+json',
                    },
                }
            )

            if (response.status !== 204) {
                throw new JavaApiError(
                    response.status,
                    response.config.url,
                    JSON.parse(response.data) || []
                )
            }
        } catch (e) {
            if (e instanceof JavaApiError) {
                throw e
            }

            throw new GenericJavaApiError(e.toString())
        }
    }

    async transferOwnership(newOwnerId, clanId) {
        try {
            const transferRequestBody = {
                data: {
                    type: 'clan',
                    id: clanId,
                    relationships: {
                        leader: {
                            data: {
                                id: newOwnerId,
                                type: 'player',
                            },
                        },
                    },
                },
            }

            const response = await this.javaApiClient.patch(
                '/data/clan/' + clanId,
                JSON.stringify(transferRequestBody),
                {
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        Accept: 'application/vnd.api+json',
                    },
                }
            )

            if (response.status !== 204) {
                throw new JavaApiError(
                    response.status,
                    response.config.url,
                    JSON.parse(response.data) || []
                )
            }
        } catch (e) {
            if (e instanceof JavaApiError) {
                throw e
            }

            throw new GenericJavaApiError(e.toString())
        }
    }

    async createInvite(clanId, playerId) {
        try {
            const response = await this.javaApiClient.get(
                `/clans/generateInvitationLink?clanId=${clanId}&playerId=${playerId}`
            )

            if (response.status !== 200) {
                throw new JavaApiError(
                    response.status,
                    response.config.url,
                    JSON.parse(response.data) || []
                )
            }

            const rawToken = JSON.parse(response.data)

            return rawToken.jwtToken || null
        } catch (e) {
            if (e instanceof JavaApiError) {
                throw e
            }

            throw new GenericJavaApiError(e.toString())
        }
    }

    async acceptInvitation(token) {
        try {
            const response = await this.javaApiClient.post(
                `/clans/joinClan?token=${token}`
            )

            if (response.status !== 200) {
                throw new JavaApiError(
                    response.status,
                    response.config.url,
                    JSON.parse(response.data) || []
                )
            }
        } catch (e) {
            if (e instanceof JavaApiError) {
                throw e
            }

            throw new GenericJavaApiError(e.toString())
        }
    }

    async removeClanMembership(membershipId) {
        try {
            const response = await this.javaApiClient.delete(
                `/data/clanMembership/${membershipId}`
            )

            if (response.status !== 204) {
                throw new JavaApiError(
                    response.status,
                    response.config.url,
                    JSON.parse(response.data) || []
                )
            }
        } catch (e) {
            if (e instanceof JavaApiError) {
                throw e
            }

            throw new GenericJavaApiError(e.toString())
        }
    }
}

module.exports.ClanManagementRepository = ClanManagementRepository
