const { JavaApiError } = require('../../../services/ApiErrors')

exports = module.exports = [
    async (req, res) => {
        const newOwnerMemberId = req.params.memberId
        const clanId = req.requestContainer.get('UserService').getUser().clan.id
        try {
            await req.requestContainer
                .get('ClanManagementService')
                .transferOwnership(newOwnerMemberId)
            await req.asyncFlash('info', 'Clan ownership transferred')

            return res.redirect(`/clans/view/${clanId}`)
        } catch (e) {
            console.log('<==============HIT ERROR ==============>')
            let message = e.toString()
            if (e instanceof JavaApiError && e.error?.errors) {
                message = e.error.errors[0].detail
            }

            await req.asyncFlash('error', message)
            return res.redirect(`/clans/view/${clanId}`)
        }
    },
]
