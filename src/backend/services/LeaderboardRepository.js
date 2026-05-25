const { JavaApiPaginator } = require('./JavaApiPaginator')

class LeaderboardRepository {
    constructor(javaApiClient, monthsInThePast = 12) {
        this.javaApiClient = javaApiClient
        this.monthsInThePast = monthsInThePast
    }

    getUpdateTimeForApiEntries() {
        const date = new Date()
        date.setMonth(date.getMonth() - this.monthsInThePast)

        return date.toISOString()
    }

    async fetchLeaderboard(id) {
        const updateTime = this.getUpdateTimeForApiEntries()

        const merged = await JavaApiPaginator.fetchAll(
            this.javaApiClient,
            `/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==${id};updateTime=ge=${updateTime}`,
            'LeaderboardRepository'
        )

        return this.mapResponse(merged)
    }

    mapResponse(data) {
        if (typeof data !== 'object' || data === null) {
            throw new Error(
                'LeaderboardRepository::mapResponse malformed response, not an object'
            )
        }

        if (!Object.prototype.hasOwnProperty.call(data, 'data')) {
            throw new Error(
                'LeaderboardRepository::mapResponse malformed response, expected "data"'
            )
        }

        if (data.data.length === 0) {
            console.log('[info] leaderboard empty')

            return []
        }

        if (!Object.prototype.hasOwnProperty.call(data, 'included')) {
            throw new Error(
                'LeaderboardRepository::mapResponse malformed response, expected "included"'
            )
        }

        const playersById = new Map()
        for (const item of data.included) {
            if (item && item.type === 'player') {
                playersById.set(item.id, item)
            }
        }

        const leaderboardData = []

        data.data.forEach((item) => {
            try {
                const playerId = item.relationships?.player?.data?.id ?? item.id
                const player = playersById.get(playerId)
                leaderboardData.push({
                    playerId,
                    rating: item.attributes.rating,
                    totalgames: item.attributes.totalGames,
                    wonGames: item.attributes.wonGames,
                    date: item.attributes.updateTime,
                    label: player?.attributes?.login || 'unknown user',
                })
            } catch (e) {
                console.error(
                    'LeaderboardRepository::mapResponse failed on item with "' +
                        e.toString() +
                        '"'
                )
            }
        })

        return leaderboardData
    }
}

module.exports.LeaderboardRepository = LeaderboardRepository
