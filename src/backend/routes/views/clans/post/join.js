const request = require('request')

exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'clan'

    const flash = {}
    const overallRes = res

    if (!req.query.token || !req.query.clan_id) {
        flash.type = 'Error!'
        flash.class = 'alert-danger'
        flash.messages = [{ msg: 'The invitation link is invalid!' }]

        const buff = Buffer.from(JSON.stringify(flash))
        const data = buff.toString('base64')

        return res.redirect('/clans?flash=' + data + '')
    }

    const token = req.query.token

    request.post(
        {
            url: process.env.API_URL + '/clans/joinClan?token=' + token,
            headers: {
                Authorization: 'Bearer ' + req.user.data.attributes.token
            }
        },
        function (err, childRes, body) {
            if (err) {
                console.error('There was an error at join')

                return
            }

            let flashData
            if (childRes.statusCode === 200 || childRes.statusCode === 201) {
                flash.class = 'alert-success'
                flash.messages = [
                    { msg: 'Welcome to your new clan!' }
                ]
                flash.type = 'Success!'
                const buff = Buffer.from(JSON.stringify(flash))
                flashData = buff.toString('base64')

                // Refreshing user
                return request.get({
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
                            return overallRes.redirect(`${user.data.attributes.clan.tag}?member=true&flash=${flashData}`)
                        })
                    } catch {
                        console.error('There was an error updating a session after an user left a clan')
                    }
                })
            } else {
                flash.type = 'Error!'
                flash.class = 'alert-danger'
                let msg = 'The invitation is invalid or has expired, or you are already part of a clan'
                try {
                    msg += ': ' + JSON.stringify(JSON.parse(childRes.body).errors[0].detail)
                } catch {}

                flash.messages = [{ msg }]

                const buff = Buffer.from(JSON.stringify(flash))
                flashData = buff.toString('base64')

                return overallRes.redirect('/clans?flash=' + flashData + '')
            }
        }
    )
}
