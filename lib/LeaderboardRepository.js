class LeaderboardRepository {
    constructor(javaApiClient, monthsInThePast = 12) {
        this.javaApiClient = javaApiClient
        this.monthsInThePast = monthsInThePast
    }

    getUpdateTimeForApiEntries() {
        const date = new Date();
        date.setMonth(date.getMonth() - this.monthsInThePast);

        return date.toISOString()
    }

    async fetchLeaderboard(id) {
        const updateTime = this.getUpdateTimeForApiEntries()

        let response = await this.javaApiClient.get(`/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==${id};updateTime=ge=${updateTime}&page[size]=9999`);

        if (response.status !== 200) {
            throw new Error('LeaderboardRepository::fetchLeaderboard failed with response status "' + response.status + '"')
        }

        return this.mapResponse(JSON.parse(response.data))
    }

    mapResponse(data) {
        if (typeof data !== 'object' || data === null) {
            throw new Error('LeaderboardRepository::mapResponse malformed response, not an object')
        }

        if (!data.hasOwnProperty('data')) {
            throw new Error('LeaderboardRepository::mapResponse malformed response, expected "data"')
        }

        if (data.data.length === 0) {
            console.log('[info] leaderboard empty')

            return []
        }

        if (!data.hasOwnProperty('included')) {
            throw new Error('LeaderboardRepository::mapResponse malformed response, expected "included"')
        }

        let leaderboardData = []

        data.data.forEach((item, index) => {
            try {
                leaderboardData.push({
                    rating: item.attributes.rating,
                    totalgames: item.attributes.totalGames,
                    wonGames: item.attributes.wonGames,
                    date: item.attributes.updateTime,
                    label: data.included[index]?.attributes.login || 'unknown user',
                })
            } catch (e) {
                console.error('LeaderboardRepository::mapResponse failed on item with "' + e.toString() + '"')
            }
            
        })

        return leaderboardData
    }
}

module.exports = LeaderboardRepository
