const { JavaApiError } = require('../../../services/ApiErrors')

exports = module.exports = async function (req, res) {
    if (!req.query.token) {
        await req.asyncFlash('error', 'The invitation link is invalid!')

        return res.redirect('/clans')
    }
    const token = req.query.token

    try {
        await req.requestContainer.get('ClanManagementService').acceptInvitation(token)
        await req.asyncFlash('info', 'Clan joined!')

        return res.redirect('/clans/view/' + req.requestContainer.get('UserService').getUser().clan.id)
    } catch (e) {
        console.log(e.stack)
        let message = e.toString()

        if (e instanceof JavaApiError && e.error?.errors) {
            message = e.error.errors[0].detail

            if (e.error.errors[0].code === '152') {
                await req.asyncFlash('error', message)
                return res.redirect('/clans')
            }
        }

        await req.asyncFlash('error', message)

        return res.redirect('/clans')
    }
}
