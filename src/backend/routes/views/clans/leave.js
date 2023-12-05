const { JavaApiError } = require('../../../services/ApiErrors')

exports = module.exports = async function (req, res) {
    const user = req.requestContainer.get('UserService').getUser()

    if (!user.clan.membershipId) {
        await req.asyncFlash('info', 'You are not in a clan')

        return res.redirect('/clans')
    }

    if (req.method === 'POST') {
        try {
            await req.requestContainer.get('ClanManagementService').leaveClan()
            await req.asyncFlash('info', 'Clan left')

            return res.redirect('/clans')
        } catch (e) {
            console.error(e.stack)
            let message = e.toString()
            if (e instanceof JavaApiError && e.error?.errors) {
                message = e.error.errors[0].detail
            }

            await req.asyncFlash('error', message)

            return res.redirect('/clans')
        }
    }

    return res.render('clans/leave')
}
