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
    let errors = validationResult(req)

    // Should not happen normally, but you never know
    if (req.body.membership_id === req.user.clan.membershipId) errors = [{ msg: 'You cannot kick yourself' }]

    // Must have client side errors to fix
    if (!errors.isEmpty()) {
        flash.class = 'alert-danger'
        flash.messages = errors
        flash.type = 'Error!'

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return overallRes.redirect('manage?flash=' + data)
    } else {
    // Building update query
        const membershipId = req.body.membership_id
        const queryUrl =
      process.env.API_URL +
      '/data/clanMembership/' + membershipId

        // Run post to endpoint
        request.delete({
            url: queryUrl,
            body: '',
            headers: {
                Authorization: 'Bearer ' + req.user.data.attributes.token
            }
        }, function (err, res, body) {
            const errorMessages = []

            if (err || res.statusCode !== 204) {
                let msg = 'Error while removing the member'
                try {
                    msg += ': ' + JSON.stringify(JSON.parse(res.body).errors[0].detail)
                } catch {}
                errorMessages.push({ msg })
                flash.class = 'alert-danger'
                flash.messages = errorMessages
                flash.type = 'Error!'

                const buff = Buffer.from(JSON.stringify(flash))
                const data = buff.toString('base64')

                return overallRes.redirect('manage?flash=' + data)
            }

            flash = {}
            flash.class = 'alert-success'
            flash.messages = [{ msg: 'The member was kicked' }]
            flash.type = 'Success!'

            const buff = Buffer.from(JSON.stringify(flash))
            const data = buff.toString('base64')

            return overallRes.redirect('manage?flash=' + data)
        })
    }
}
