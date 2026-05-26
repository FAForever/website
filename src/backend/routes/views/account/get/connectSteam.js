const axios = require('axios')
const flash = {}

exports = module.exports = function (req, res) {
    const locals = res.locals

    locals.section = 'account'
    const overallRes = res

    axios
        .post(
            process.env.API_URL + '/users/buildSteamLinkUrl',
            new URLSearchParams({
                callbackUrl:
                    req.protocol +
                    '://' +
                    req.get('host') +
                    '/account/link?done',
            }),
            {
                headers: {
                    Authorization:
                        'Bearer ' +
                        req.requestContainer.get('UserService').getUser()
                            ?.oAuthPassport.token,
                },
                transformResponse: [(r) => r],
                validateStatus: () => true,
            }
        )
        .then((response) => {
            // Must not be valid, check to see if errors, otherwise return generic error.
            try {
                const body = JSON.parse(response.data)

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
        })
        .catch(() => {
            flash.class = 'alert-danger'
            flash.messages = [
                {
                    msg: 'Your steam account was not successfully linked! Please verify you logged into the website correctly.',
                },
            ]
            flash.type = 'Error!'

            return overallRes.render('account/linkSteam', { flash })
        })
}
