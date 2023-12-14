const { validationResult, body, matchedData } = require('express-validator')
const getReportRoute = require('../get/report')

exports = module.exports = [
    body('offender', 'Offender invalid')
        .isString()
        .isLength({ min: 2, max: 50 })
        .trim()
        .escape(),
    body('report_description', 'Please describe the incident')
        .notEmpty()
        .isLength({ min: 2, max: 2000 })
        .trim()
        .escape(),
    body(
        'game_id',
        'Please enter a valid game ID, or nothing. The # is not needed.'
    )
        .optional({ values: 'falsy' })
        .isDecimal(),
    async function (req, res) {
        const javaApiClient = req.requestContainer.get('JavaApiClient')
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.query.flash = Buffer.from(
                JSON.stringify({
                    class: 'alert-danger',
                    messages: errors,
                    type: 'Error!',
                })
            ).toString('base64')

            return getReportRoute(req, res)
        }

        const formData = matchedData(req)

        let apiUsers
        try {
            const userFetch = await javaApiClient.get(
                '/data/player?filter=login==' +
                    encodeURIComponent(formData.offender) +
                    '&fields[player]=login&page[size]=1'
            )

            if (userFetch.status !== 200) {
                throw new Error('issues getting players')
            }

            apiUsers = JSON.parse(userFetch.data)
        } catch (e) {
            req.query.flash = Buffer.from(
                JSON.stringify({
                    class: 'alert-danger',
                    messages: {
                        errors: [{ msg: 'Error while fetching offender' }],
                    },
                    type: 'Error!',
                })
            ).toString('base64')

            return getReportRoute(req, res)
        }

        // Mapping users to their IDs
        let offenderId = null
        apiUsers.data.forEach((user) => {
            if (
                user.attributes.login.toUpperCase() ===
                formData.offender.toUpperCase()
            ) {
                offenderId = user.id
            }
        })

        if (!offenderId) {
            req.query.flash = Buffer.from(
                JSON.stringify({
                    class: 'alert-danger',
                    messages: {
                        errors: [
                            {
                                msg:
                                    'The following user could not be found : ' +
                                    formData.offender,
                            },
                        ],
                    },
                    type: 'Error!',
                })
            ).toString('base64')

            return getReportRoute(req, res)
        }

        // Checking the game exists
        if (formData.game_id != null) {
            try {
                const response = await javaApiClient.get(
                    '/data/game?filter=id==' +
                        encodeURIComponent(formData.game_id)
                )
                if (response.status !== 200) {
                    throw new Error('issues getting game')
                }
            } catch (e) {
                req.query.flash = Buffer.from(
                    JSON.stringify({
                        class: 'alert-danger',
                        messages: {
                            errors: [
                                {
                                    msg: 'The game could not be found. Please check the game ID you provided.',
                                },
                            ],
                        },
                        type: 'Error!',
                    })
                ).toString('base64')

                return getReportRoute(req, res)
            }
        }

        const relationShips = {
            reportedUsers: {
                data: [
                    {
                        type: 'player',
                        id: '' + offenderId,
                    },
                ],
            },
        }

        if (formData.game_id != null) {
            relationShips.game = {
                data: { type: 'game', id: '' + formData.game_id },
            }
        }

        const report = {
            data: [
                {
                    type: 'moderationReport',
                    attributes: {
                        gameIncidentTimecode: formData.game_timecode
                            ? formData.game_timecode
                            : null,
                        reportDescription: formData.report_description,
                    },
                    relationships: relationShips,
                },
            ],
        }

        const resp = await javaApiClient.post(
            '/data/moderationReport',
            JSON.stringify(report),
            {
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    Accept: 'application/vnd.api+json',
                },
            }
        )

        if (resp.status !== 201) {
            const apiError = JSON.parse(resp.data)
            req.query.flash = Buffer.from(
                JSON.stringify({
                    class: 'alert-danger',
                    messages: {
                        errors: [
                            { msg: 'Error while submitting the report form' },
                            {
                                msg:
                                    apiError.errors?.[0]?.detail ||
                                    'unknown api error',
                            },
                        ],
                    },
                    type: 'Error!',
                })
            ).toString('base64')

            return getReportRoute(req, res)
        }

        res.redirect('../report_submitted')
    },
]
