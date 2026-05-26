const axios = require('axios')
const error = require('../post/error')

exports = module.exports = function (req, res) {
    const locals = res.locals

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'account'

    locals.formData = req.body || {}

    let flash = {}
    if (req.query.done !== undefined) {
        if (req.query.errors) {
            const errors = JSON.parse(req.query.errors)

            flash.class = 'alert-danger'
            flash.messages = errors.map((error) => ({ msg: error.detail }))
            flash.type = 'Error!'
        }
    } else {
        flash = null
    }

    const overallRes = res

    axios
        .get(process.env.API_URL + '/users/buildGogProfileToken', {
            headers: {
                Authorization:
                    'Bearer ' +
                    req.requestContainer.get('UserService').getUser()
                        ?.oAuthPassport.token,
            },
            transformResponse: [(r) => r],
            validateStatus: () => true,
            timeout: 10000,
        })
        .then((response) => {
            locals.gogToken = 'unable to obtain token'
            if (response.status !== 200) {
                flash = {}
                error.parseApiErrors(response.data, flash)
                return overallRes.render('account/linkGog', { flash })
            }

            locals.gogToken = JSON.parse(response.data).gogToken

            // Render the view
            overallRes.render('account/linkGog', { flash })
        })
        .catch(() => {
            locals.gogToken = 'unable to obtain token'
            flash = {}
            error.parseApiErrors(null, flash)
            return overallRes.render('account/linkGog', { flash })
        })
}
