const { JavaApiError } = require('../../../services/ApiErrors')
const { body } = require('express-validator')
const url = require('url')

exports = module.exports = [
    body('invited_player', 'Please select a player').notEmpty().isLength({ max: 20 }),
    async (req, res) => {
        if (req.method === 'POST') {
            const user = await req.appContainer.get('DataRepository').fetchUserByName(req.body.invited_player)

            if (!user) {
                await req.asyncFlash('error', 'User not found')
                return res.render('clans/invite', {
                    invited_player: req.body.invited_player
                })
            }

            try {
                const invitation = await req.requestContainer.get('ClanManagementService').createInvite(user.id)

                return res.render('clans/invite', {
                    invited_player: req.body.invited_player,
                    link: url.format({
                        pathname: '/clans/invite-accept',
                        query: {
                            token: encodeURIComponent(invitation)
                        }
                    })
                })
            } catch (e) {
                let message = e.toString()
                if (e instanceof JavaApiError && e.error?.errors) {
                    message = e.error.errors[0].detail
                }

                await req.asyncFlash('error', message)

                return res.redirect('/clans/manage')
            }
        }

        return res.render('clans/invite', {
            invited_player: ''
        })
    }
]
