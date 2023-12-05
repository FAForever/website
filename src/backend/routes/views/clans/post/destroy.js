const { JavaApiError } = require('../../../../services/ApiErrors')

module.exports = async function (req, res) {
    try {
        await req.requestContainer.get('ClanManagementService').deleteClan()
        await req.asyncFlash('info', 'Clan deleted')
        res.redirect('/clans/create')
    } catch (e) {
        let message = e.toString()
        if (e instanceof JavaApiError && e.error?.errors) {
            message = e.error.errors[0].detail
        }

        await req.asyncFlash('error', message)

        return res.redirect('/clans/manage')
    }
}
