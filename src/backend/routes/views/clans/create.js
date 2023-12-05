const { body, validationResult, matchedData } = require('express-validator')
const { JavaApiError } = require('../../../services/ApiErrors')

module.exports =
    [
        body('clan_tag', 'Please indicate the clan tag - No special characters and 3 characters maximum').notEmpty().isLength({ max: 3 }),
        body('clan_description', 'Please add a description for your clan').notEmpty().isLength({ max: 1000 }),
        body('clan_name', "Please indicate your clan's name").notEmpty().isLength({ max: 40 }),
        async (req, res) => {
            if (req.requestContainer.get('UserService').getUser()?.clan) {
                return res.redirect('/clans/manage')
            }

            if (req.method === 'POST') {
                const errors = validationResult(req)

                if (!errors.isEmpty()) {
                    return res.render('clans/create', {
                        errors: {
                            class: 'alert-danger',
                            messages: errors,
                            type: 'Error!'
                        },
                        clan_tag: req.body.clan_tag,
                        clan_name: req.body.clan_name,
                        clan_description: req.body.clan_description
                    })
                }

                try {
                    const data = matchedData(req)
                    await req.requestContainer.get('ClanManagementService').create(data.clan_tag, data.clan_name, data.clan_description)

                    await req.asyncFlash('info', 'Clan created')

                    return res.redirect('/clans/view/' + req.requestContainer.get('UserService').getUser().clan.id)
                } catch (e) {
                    let messages = { errors: [{ msg: 'Server-Error while creating the clan' }] }

                    console.error(e.stack)
                    if (e instanceof JavaApiError && e.error.errors[0]) {
                        messages = { errors: [{ msg: e.error.errors[0].detail }] }
                    }

                    return res.render('clans/create', {
                        clan_tag: req.body.clan_tag,
                        clan_name: req.body.clan_name,
                        clan_description: req.body.clan_description,
                        errors: {
                            class: 'alert-danger',
                            messages,
                            type: 'Error!'
                        }
                    })
                }
            }

            res.render('clans/create', {
                clan_tag: '',
                clan_name: '',
                clan_description: ''
            })
        }
    ]
