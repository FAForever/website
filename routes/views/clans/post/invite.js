const axios = require('axios');
const error = require("../../account/post/error");


exports = module.exports = async (req, res) => {
    // Let's get the local variables
    const clanId = req.body.clan_id;
    const userName = req.body.invited_player;
    let playerId = null;
    // Let's check first that the player exists
    await axios.get(`${process.env.API_URL}/data/player?filter=login==${userName}&fields[player]=`)
        .then(response => {

            // Player exists
            if (response.data.data[0] ? response.data.data[0] : false) {
                playerId = response.data.data[0].id;

            } else { // Player doesn't exist

                res.redirect(`manage?invitation_id=error`);
            }
        }).catch(e => {
            console.log(e);
            res.redirect(`manage?invitation_id=error`);
        });
    //Player does exist, lets create the invite link
    if (playerId !== null) {
        await axios.get(`${process.env.API_URL}/clans/generateInvitationLink?clanId=${clanId}&playerId=${playerId}`,
            {
                headers: {'Authorization': `Bearer ${req.user.token}`},
            }).then(response => {
            let data = response.data;
            const token = data.jwtToken;
            let id = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5).toUpperCase();
            req.app.locals.clanInvitations[id] = {
                token: token,
                clan: clanId
            };
            res.redirect(`manage?invitation_id=${id}`);
        }).catch(e => {
            console.log(e);
            res.redirect(`manage?invitation_id=error`);
        });
    }
};
