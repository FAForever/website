const flash = {}
const request = require('request')
const { check, validationResult } = require('express-validator')

exports = module.exports = async function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}

    const overallRes = res

    // validate the input
    check('clan_tag', 'Please indicate the clan tag - No special characters and 3 characters maximum').notEmpty().isLength({ max: 3 })
    check('clan_description', 'Please add a description for your clan').notEmpty().isLength({ max: 1000 })
    check('clan_name', "Please indicate your clan's name").notEmpty().isLength({ max: 40 })

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return overallRes.redirect('create?flash=' + data)
    } else {
        const clanName = req.body.clan_name
        const clanTag = req.body.clan_tag
        const clanDescription = req.body.clan_description

        const queryUrl =
      process.env.API_URL +
      '/clans/create' +
      '?name=' + encodeURIComponent(clanName) +
      '&tag=' + encodeURIComponent(clanTag) +
      '&description=' + encodeURIComponent(clanDescription)

        // Run post to endpoint
        request.post({
            url: queryUrl,
            body: '',
            headers: {
                Authorization: 'Bearer ' + req.user.data.attributes.token
            }
        }, function (err, res, body) {
            const errorMessages = []

            if (err || res.statusCode !== 200) {
                let msg = 'Error while creating the clan'
                try {
                    msg += ': ' + JSON.stringify(JSON.parse(res.body).errors[0].detail)
                } catch {
                }
                errorMessages.push({ msg })
                flash.class = 'alert-danger'
                flash.messages = errorMessages
                flash.type = 'Error!'

                const buff = Buffer.from(JSON.stringify(flash))
                const data = buff.toString('base64')

                return overallRes.redirect('create?flash=' + data + '&clan_name=' + clanName + '&clan_tag=' + clanTag + '&clan_description=' + clanDescription + '')
            }

            // Refreshing user
            request.get({
                url: process.env.API_URL + '/me',
                headers: {
                    Authorization: 'Bearer ' + req.user.data.attributes.token
                }
            },
            function (err, res, body) {
                if (err) {
                    console.error('There was an error updating a session after a clan creation')

                    return
                }
                try {
                    const user = JSON.parse(body)
                    user.data.attributes.token = req.user.data.attributes.token
                    user.data.id = user.data.attributes.userId
                    req.logIn(user, function (err) {
                        if (err) console.error(err)
                        return overallRes.redirect('/clans/manage')
                    })
                } catch {
                    console.error('There was an error updating a session after a clan creation')
                }
            })
        })
    }
}
