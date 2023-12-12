const { query, validationResult, matchedData } = require('express-validator')

module.exports = [
    query('id').notEmpty().isInt(),

    async (req, res) => {
        const result = validationResult(req)

        if (result.isEmpty()) return res.redirect('/clans')

        const data = matchedData(req)

        return res.render('clans/clan', {
            clan: await req.appContainer.get('ClanService').getClan(data.id),
        })
    },
]
