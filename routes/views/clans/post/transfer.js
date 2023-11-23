const axios = require('axios');
const error = require("../../account/post/error");

exports = module.exports = function (req, res) {

    const clanId = req.body.clan_id;
    const transferUsername = req.body.transfer_to;
    let playerId = null;



    // If clan id or the transfer username are missing, then we can't transfer an unknown clan to an unknown clan member.
    if (!transferUsername || !clanId) res.redirect('manage?flash=error&error=missingData');

    else {


        // Let's check first that the player exists AND is part of this clan
        axios.get(`${process.env.API_URL}/data/clan/${clanId}?include=memberships.player&fields[player]=login`)
            .then(response => {

                // can't transfer clan to yourself
                if (transferUsername === req.user.data.attributes.userName) res.redirect('manage?flash=error&error=transferToSelf');


                // Lets make an array of all members


                response.data.included.forEach(player => {
                    if (player.type === "player") {
                        if (player.attributes.login === transferUsername) playerId = player.id;

                    }
                });

            }).then(() => {

//Lets check our array for our transfer player
            if (playerId === null) res.redirect('manage?flash=error&error=notClanMember');
            else {

                const newClanObject =
                    {
                        "data": {
                            "type": "clan",
                            "id": clanId,
                            "relationships": {
                                "leader": {
                                    "data": {
                                        "id": playerId,
                                        "type": "player"
                                    }
                                }
                            }
                        }
                    };

                //Run post to endpoint / Transfer clan
                axios.patch(`${process.env.API_URL}/data/clan/${clanId}`, newClanObject,
                    {

                        headers: {
                            'Authorization': `Bearer ${req.user.token}`,
                            'Content-Type': 'application/vnd.api+json'
                        }
                    }).then(() => {
                    // Refreshing user
                    error.userUpdate(req, res, `../clans?flash=transfer&newLeader=${transferUsername}`);

                }).catch(e => {

                    res.redirect('manage?flash=error');
                });
            }


        }).catch(e => {

            res.redirect('manage?flash=error');
        });

    }


};
