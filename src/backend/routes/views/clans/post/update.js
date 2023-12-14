const { validationResult, body, matchedData } = require('express-validator')
const { JavaApiError } = require('../../../../services/ApiErrors')

exports = module.exports = [
    body(
        'clan_tag',
        'Please indicate the clan tag - No special characters and 3 characters maximum'
    )
        .notEmpty()
        .isLength({ max: 3 }),
    body('clan_description', 'Cannot exceed 1000 characters').isLength({
        max: 1000,
    }),
    body('clan_description', 'Cannot be empty').notEmpty(),
    body('clan_name', "Please indicate your clan's name")
        .notEmpty()
        .isLength({ max: 40 }),

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

        try {
            const data = matchedData(req)
            await req.requestContainer
                .get('ClanManagementService')
                .update(data.clan_tag, data.clan_name, data.clan_description)
            await req.asyncFlash('info', 'Clan updated')

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
