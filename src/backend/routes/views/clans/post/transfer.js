const { body, validationResult, matchedData } = require('express-validator')
const { JavaApiError } = require('../../../../services/ApiErrors')

exports = module.exports = [
    // Validations will need to change
    body('transfer_to', 'Please indicate the recipient name').notEmpty(),
    body(
        'clan_id',
        'Internal error while processing your query: invalid clan ID'
    ).notEmpty(),

    async (req, res) => {
        const errors = validationResult(req)
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

        // This will also need changed
        const newOwner = matchedData(req).body.transfer_to
        try {
            await req.requestContainer
                .get('ClanManagementService')
                .transferOwnership(newOwner)
            await req.asyncFlash(
                'info',
                `Clan ownership transferred to ${newOwner}`
            )

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
