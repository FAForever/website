const {check, validationResult} = require('express-validator');
const error = require("../../account/post/error");
const appConfig = require("../../../../config/app");
const axios = require('axios')
const ClanRepository = require('../../../../lib/clan/ClanRepository')
const {JavaApiError} = require("../../../../lib/ApiErrors");

exports = module.exports = [

    // validate the input
    check('clan_tag', 'Please indicate the clan tag - No special characters and 3 characters maximum').isLength({max: 3}),
    check('clan_description', 'Please add a description for your clan').notEmpty().isLength({max: 1000}),
    check('clan_name', "Please indicate your clan's name").isLength({max: 64}),
    check('clan_id', 'Internal error while processing your query: invalid clan ID').notEmpty(),

    async (req, res) => {
        // check the validation object for errors
        if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'clans');
        // No errors in form, continue ahead
        else {

            const newName = req.body.clan_name;
            const newTag = req.body.clan_tag;
            const clanDescription = req.body.clan_description;


            const config = {
                baseURL: appConfig.apiUrl,
                headers: {
                    'Authorization': `Bearer ${req.user.token}`
                }
            };
            const javaApiClient = axios.create(config)
            const clanRepository = new ClanRepository(javaApiClient)
            
            try {
                const clan = await clanRepository.updateClan(req.body.clan_id, newName, clanDescription, newTag)

                return res.redirect('/clans/manage?flash=update');
            } catch (e) {
                if (e instanceof JavaApiError) {
                    req.flash('info', 'Flash is back!')
                }
                return res.redirect('/clans/manage')
            }
        }
    }
];
