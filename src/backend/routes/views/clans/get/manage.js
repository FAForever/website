const { JavaApiError } = require('../../../../services/ApiErrors')
exports = module.exports = async (req, res) => {
    // if something changed in another session we should refresh the user first
    await req.requestContainer.get('UserService').refreshUser()

    const clanMembershipId =
        req.requestContainer.get('UserService').getUser()?.clan?.membershipId ||
        null
    if (!clanMembershipId) {
        await req.asyncFlash('error', "You don't belong to a clan")

        return res.redirect('/clans')
    }

    try {
        const clan = await req.appContainer
            .get('ClanService')
            .getClanMembership(clanMembershipId)

        return res.render('clans/manage', {
            clan_description: clan.clan_description,
            clan_name: clan.clan_name,
            clan_tag: clan.clan_tag,
        })
    } catch (e) {
        let message = e.toString()
        if (e instanceof JavaApiError && e.error?.errors) {
            message = e.error.errors[0].detail
        }

        await req.asyncFlash('error', message)

        return res.redirect('/clans')
    }
}
