const request = require('request')
const flash = {}

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.section = 'account'
    const overallRes = res

    request.post(
        {
            url: process.env.API_URL + '/users/buildSteamLinkUrl',
            headers: {
                Authorization:
                    'Bearer ' +
                    req.requestContainer.get('UserService').getUser()
                        ?.oAuthPassport.token,
            },
            form: {
                callbackUrl:
                    req.protocol +
                    '://' +
                    req.get('host') +
                    '/account/link?done',
            },
        },
        function (err, res, body) {
            if (err) {
                flash.class = 'alert-danger'
                flash.messages = [
                    {
                        msg: 'Your steam account was not successfully linked! Please verify you logged into the website correctly.',
                    },
                ]
                flash.type = 'Error!'

                return overallRes.render('account/linkSteam', { flash })
            }
            // Must not be valid, check to see if errors, otherwise return generic error.
            try {
                body = JSON.parse(body)

                if (body.steamUrl) {
                    return overallRes.redirect(body.steamUrl)
                }

                const errorMessages = []

                for (let i = 0; i < body.errors.length; i++) {
                    const error = body.errors[i]
                    errorMessages.push({ msg: error.detail })
                }

                flash.class = 'alert-danger'
                flash.messages = errorMessages
                flash.type = 'Error!'

                overallRes.render('account/linkSteam', { flash })
            } catch (e) {
                flash.class = 'alert-danger'
                flash.messages = [
                    {
                        msg: 'Your steam account was not successfully linked! Please verify you logged into the website correctly.',
                    },
                ]
                flash.type = 'Error!'

                overallRes.render('account/linkSteam', { flash })
            }
        }
    )
}
