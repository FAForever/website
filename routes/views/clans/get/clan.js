const axios = require('axios')

exports = module.exports = async (req, res) => {
    const clanId = parseInt(req.params.id || null)
    
    if (!clanId) {
        return res.redirect('/clans')
    } 

    return res.render('clans/clan', {clan: await req.services.clanService.getClan(clanId)});
}
