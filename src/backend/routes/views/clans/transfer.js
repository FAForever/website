const { JavaApiError } = require('../../../services/ApiErrors')

exports = module.exports = [
    async (req, res) => {
        const newOwnerMemberId = req.params.memberId
        const clanId = req.requestContainer.get('UserService').getUser().clan.id
        try {
            await req.requestContainer
                .get('ClanManagementService')
                .transferOwnership(newOwnerMemberId, clanId)
            await req.asyncFlash('info', 'Clan ownership transferred')

            return res.redirect(`/clans/view/${clanId}`, {
                clan_tag: req.body.clan_tag,
                clan_name: req.body.clan_name,
                clan_description: req.body.clan_description,
            })
        } catch (e) {
            let message = e.toString()
            if (e instanceof JavaApiError && e.error?.errors) {
                message = e.error.errors[0].detail
            }

            await req.asyncFlash('error', message)
            return res.redirect(`/clans/view/${clanId}`, {
                clan_tag: req.body.clan_tag,
                clan_name: req.body.clan_name,
                clan_description: req.body.clan_description,
            })
        }
    },
]
