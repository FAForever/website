let flash = {}
const request = require('request')
const { check, validationResult } = require('express-validator')

exports = module.exports = async function (req, res) {
    const locals = res.locals

    locals.formData = req.body || {}

    const overallRes = res

    // validate the input
    check('clan_id', 'Internal error while processing your query: invalid clan ID').notEmpty()
    check('membership_id', 'Internal error while processing your query: invalid member ID').notEmpty()

    // check the validation object for errors
    const errors = validationResult(req)

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return overallRes.redirect('/clans?flash=' + data)
    } else {
    // Building update query
        // Run post to endpoint
        request.delete({
            url: `${process.env.API_URL}/data/clanMembership/${req.user.clan.membershipId}`,
            headers: {
                Authorization: 'Bearer ' + req.user.data.attributes.token
            }
        }, function (err, res, body) {
            const errorMessages = []

            if (err || res.statusCode !== 204) {
                let msg = 'Error while leaving the clan'
                try {
                    msg += ': ' + JSON.stringify(JSON.parse(res.body).errors[0].detail)
                } catch {
                    errorMessages.push({ msg })
                    flash.class = 'alert-danger'
                    flash.messages = errorMessages
                    flash.type = 'Error!'
                }

                const buff = Buffer.from(JSON.stringify(flash))
                const data = buff.toString('base64')

                return overallRes.redirect('/clans?flash=' + data)
            }

            flash = {}
            flash.class = 'alert-success'
            flash.messages = [{ msg: 'You left the clan' }]
            flash.type = 'Success!'

            const buff = Buffer.from(JSON.stringify(flash))
            const data = buff.toString('base64')

            // Refreshing user
            request.get({
                url: process.env.API_URL + '/me',
                headers: {
                    Authorization: 'Bearer ' + req.user.data.attributes.token
                }
            },

            function (err, res, body) {
                if (err) {
                    console.error('There was an error updating a session after an user left a clan')

                    return
                }
                try {
                    const user = JSON.parse(body)
                    user.data.id = user.data.attributes.userId
                    user.data.attributes.token = req.user.data.attributes.token
                    req.logIn(user, function (err) {
                        if (err) console.error(err)
                        return overallRes.redirect('/clans?flash=' + data)
                    })
                } catch {
                    console.error('There was an error updating a session after an user left a clan')
                }
            })
        })
    }
}
