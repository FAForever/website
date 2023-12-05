const { JavaApiError } = require('../../../services/ApiErrors')

exports = module.exports = async function (req, res) {
    const memberId = parseInt(req.params.memberId || null)
    if (!memberId) {
        await req.asyncFlash('error', 'memberId is required')

        return res.redirect('/clans')
    }

    const user = req.requestContainer.get('UserService').getUser()

    if (!user.clan) {
        await req.asyncFlash('info', 'You are not in a clan')

        return res.redirect('/clans')
    }

    try {
        await req.requestContainer.get('ClanManagementService').kickMember(memberId)

        return res.redirect('/clans/view/' + req.requestContainer.get('UserService').getUser().clan.id)
    } catch (e) {
        let message = e.toString()
        if (e instanceof JavaApiError && e.error?.errors) {
            message = e.error.errors[0].detail
        }

        await req.asyncFlash('error', message)

        return res.redirect('/clans/view/' + req.requestContainer.get('UserService').getUser().clan.id)
    }
}
