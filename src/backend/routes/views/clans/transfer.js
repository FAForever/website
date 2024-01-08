const { JavaApiError } = require('../../../services/ApiErrors')

exports = module.exports = [
    async (req, res) => {
        if (!req.requestContainer.get('UserService').getUser()?.clan?.id) {
            await req.asyncFlash('error', "You don't own a clan")

            return res.redirect('/clans')
        }

        const newOwnerId = parseInt(req.params.userId)
        try {
            await req.requestContainer
                .get('ClanManagementService')
                .transferOwnership(newOwnerId)
            await req.asyncFlash('info', 'Clan ownership transferred')

            return res.redirect(
                '/clans/view/' +
                    req.requestContainer.get('UserService').getUser().clan.id
            )
        } catch (e) {
            let message = e.toString()
            if (e instanceof JavaApiError && e.error?.errors) {
                message = e.error.errors[0].detail
            }

            await req.asyncFlash('error', message)
            return res.redirect(
                '/clans/view/' +
                    req.requestContainer.get('UserService').getUser().clan.id
            )
        }
    },
]
