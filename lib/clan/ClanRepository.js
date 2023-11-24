class ClanRepository {
    constructor(javaApiClient) {
        this.javaApiClient = javaApiClient
    }

    async fetchAll() {
        const response = await this.javaApiClient.get('/data/clan?include=leader&fields[clan]=name,tag,description,leader,memberships,createTime&fields[player]=login&page[number]=1&page[size]=3000')
        
        if (response.status !== 200) {
            throw new Error('ClanRepository::fetchAll failed with response status "' + response.status + '"')
        }
       
        const responseData = JSON.parse(response.data)

        if (typeof responseData !== 'object' || responseData === null) {
            throw new Error('ClanRepository::fetchAll malformed response, not an object')
        }

        if (!responseData.hasOwnProperty('data')) {
            throw new Error('ClanRepository::fetchAll malformed response, expected "data"')
        }

        if (responseData.data.length === 0) {
            console.log('[info] clans empty')

            return []
        }

        if (!responseData.hasOwnProperty('included')) {
            throw new Error('ClanRepository::fetchAll malformed response, expected "included"')
        }
        
        const clans = responseData.data.map((item, index) => ({
            id: parseInt(item.id),
            leaderName: responseData.included[index]?.attributes.login || '-',
            name: item.attributes.name,
            tag: item.attributes.tag,
            createTime: item.attributes.createTime,
            description: item.attributes.description,
            population: item.relationships.memberships.data.length
        }))

        clans.sort((a, b) => {
            if (a.population > b.population) {
                return -1
            }
            if (a.population < b.population) {
                return 1
            }

            return 0
        });
        
        return await clans
    }
    
    async fetchClan(id) {
        let response = await this.javaApiClient.get(`/data/clan/${id}?include=memberships.player`)

        if (response.status !== 200) {
            throw new Error('ClanRepository::fetchClan failed with response status "' + response.status + '"')
        }

        const data = JSON.parse(response.data)
        
        if (typeof data !== 'object' || data === null) {
            throw new Error('ClanRepository::fetchClan malformed response, not an object')
        }

        if (!data.hasOwnProperty('data')) {
            throw new Error('ClanRepository::fetchClan malformed response, expected "data"')
        }

        if (typeof data.data !== 'object' || data.data === null) {
            return null
        }

        if (typeof data.included !== 'object' || data.included === null) {
            throw new Error('ClanRepository::fetchClan malformed response, expected "included"')
        }

        const clanRaw = data.data.attributes

        const clan = {
            id: data.data.id,
            name: clanRaw.name,
            tag: clanRaw.tag,
            description: clanRaw.description,
            createTime: clanRaw.createTime,
            requiresInvitation: clanRaw.requiresInvitation,
            tagColor: clanRaw.tagColor,
            updateTime: clanRaw.updateTime,
            founder: null,
            leader: null,
            memberships: {},
        }

        let members = {};

        for (let k in data.included) {
            switch (data.included[k].type) {
                case "player":
                    const player = data.included[k];
                    if (!members[player.id]) members[player.id] = {};
                    members[player.id].id = player.id;
                    members[player.id].name = player.attributes.login;
                    
                    if (player.id === data.data.relationships.leader.data.id) {
                        clan.leader = members[player.id]
                    }

                    if (player.id === data.data.relationships.founder.data.id) {
                        clan.founder = members[player.id]
                    }
                    
                    break;

                case "clanMembership":
                    const membership = data.included[k];
                    const member = membership.relationships.player.data;
                    if (!members[member.id]) members[member.id] = {};
                    members[member.id].id = member.id;
                    members[member.id].membershipId = membership.id;
                    members[member.id].joinedAt = membership.attributes.createTime;
                    break;
            }
        }

        clan.memberships = members
        
        return clan
    }
}

module.exports = ClanRepository
