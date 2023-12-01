const request = require('request')

exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'clan'
    const flash = {}

    if (!req.query.i) {
        flash.type = 'Error!'
        flash.class = 'alert-danger'
        flash.messages = [{ msg: 'The invitation link is wrong or truncated. Key informations are missing.' }]

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return res.redirect('/clans?flash=' + data)
    }

    const invitationId = req.query.i

    if (!req.app.locals.clanInvitations[invitationId]) {
        flash.type = 'Error!'
        flash.class = 'alert-danger'
        flash.messages = [{ msg: 'The invitation link is wrong or truncated. Invite code missing from website clan map.' }]

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return res.redirect('/clans?flash=' + data)
    }

    const invite = req.app.locals.clanInvitations[invitationId]
    const clanId = invite.clan

    if (req.user.data.attributes.clan != null) {
    // User is already in a clan!
        return res.redirect(`/clans/${req.user.data.attributes.clan.tag}?member=true`)
    }

    const queryUrl = process.env.API_URL +
    '/data/clan/' + clanId +
    '?include=memberships.player' +
    '&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader' +
    '&fields[player]=login,updateTime'

    request.get(
        {
            url: queryUrl
        },
        function (err, childRes, body) {
            const clan = JSON.parse(body)

            if (err || !clan.data) {
                flash.type = 'Error!'
                flash.class = 'alert-danger'
                flash.messages = [{ msg: 'The clan you want to join is invalid or does no longer exist' }]

                const buff = Buffer.from(JSON.stringify(flash))
                const data = buff.toString('base64')

                return res.redirect('./?flash=' + data)
            }

            locals.clanName = clan.data.attributes.name
            locals.clanLeaderName = '<unknown>'

            for (const k in clan.included) {
                let player = null
                switch (clan.included[k].type) {
                case 'player':
                    player = clan.included[k]

                    // Getting the leader name
                    if (player.id === clan.data.relationships.leader.data.id) {
                        locals.clanLeaderName = player.attributes.login
                    }

                    break
                }
            }

            const token = invite.token
            locals.acceptURL = `/clans/join?clan_id=${clanId}&token=${token}`

            // Render the view
            res.render('clans/accept_invite')
        }
    )
}
