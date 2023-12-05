const { JavaApiError } = require('../../../services/ApiErrors')

module.exports = async (req, res) => {
    const clanId = parseInt(req.params.id || null)
    if (!clanId) {
        return res.redirect('/clans')
    }

    try {
        let isMember = false
        let isLeader = false
        let canLeave = false

        const clan = await req.appContainer.get('ClanService').getClan(clanId)
        let user = req.requestContainer.get('UserService').getUser()

        if (user) {
            user = await req.requestContainer.get('UserService').refreshUser()
            if (parseInt(user.clan?.id) === parseInt(clan.id)) {
                isMember = true
                canLeave = true
            }

            if (user.id === clan.leader?.id) {
                isLeader = true
            }

            if (isLeader) {
                canLeave = false
            }
        }

        return res.render('clans/clan', { clan, isMember, isLeader, canLeave, userMembershipId: user?.clan?.membershipId })
    } catch (e) {
        let message = e.toString()
        if (e instanceof JavaApiError && e.error?.errors) {
            if (e.status === 404) {
                return res.status(404).render('errors/404')
            }
            message = e.error.errors[0].detail
        }

        console.error(e.stack)
        await req.asyncFlash('error', message)

        return res.redirect('/clans')
    }
}
