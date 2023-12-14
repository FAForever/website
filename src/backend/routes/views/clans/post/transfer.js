const { body, validationResult, matchedData } = require('express-validator')
const { JavaApiError } = require('../../../../services/ApiErrors')

exports = module.exports = [
    // validate the input
    body('transfer_to', 'Please indicate the recipient name').notEmpty(),
    body(
        'clan_id',
        'Internal error while processing your query: invalid clan ID'
    ).notEmpty(),

    async (req, res) => {
        const errors = validationResult(req)

        // Handle client-side errors
        if (!errors.isEmpty()) {
            return res.render('clans/manage', {
                errors: {
                    class: 'alert-danger',
                    messages: errors,
                    type: 'Error!',
                },
                clan_tag: req.body.clan_tag,
                clan_name: req.body.clan_name,
                clan_description: req.body.clan_description,
            })
        }

        // Sanitize req
        const data = matchedData(req)
        const clanId = data.body.clan_id
        const owner = data.user.data.attributes.userName
        const newOwner = data.body.transfer_to

        try {
            await req.requestContainer
                .get('ClanManagementService')
                .transferOwnership(owner, newOwner, clanId)
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

            return res.render('clans/manage', {
                clan_tag: req.body.clan_tag,
                clan_name: req.body.clan_name,
                clan_description: req.body.clan_description,
            })
        }
    },
]
