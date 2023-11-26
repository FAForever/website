const {body, validationResult} = require('express-validator');
const error = require("../../account/post/error");

exports = module.exports = [

    // validate the input
    body('clan_tag', 'Your clan tag is too long (max 3 characters)').notEmpty().isLength({max: 3}),
    body('clan_description', 'Your clan description is too long (max 1000 characters)').notEmpty().isLength({max: 1000}),
    body('clan_name', 'Your clan name is too long (max 40 characters)').isLength({max: 40}),
    async (req, res) => {
        if (!validationResult(req).isEmpty()) {
            return error.errorChecking(req, res, 'clans/create');
        }

        try {
            await req.services.clanService.createClan(req.body.clan_name,  req.body.clan_tag, req.body.clan_description)
            return res.redirect('/clans/manage')
        } catch (e) {}

        return res.redirect('/clans/create')
    }
];
