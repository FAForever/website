const decodingJWT = (token) => {
    if (token !== null) {
        const base64String = token.split('.')[1]
        return JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'))
    }
    return null
}

exports = module.exports = async function (req, res) {
    if (!req.query.token) {
        await req.asyncFlash('error', 'The invitation link is invalid!')

        return res.redirect('/clans')
    }
    const token = req.query.token

    const decodedToken = decodingJWT(req.query.token)

    if (decodedToken === null || decodedToken.clan?.name === undefined) {
        await req.asyncFlash('error', 'The invitation link is invalid!')

        return res.redirect('/clans')
    }

    if (req.requestContainer.get('UserService').getUser()?.clan) {
        await req.asyncFlash('error', 'You are already in a clan')

        return res.redirect(
            '/clans/view/' +
                req.requestContainer.get('UserService').getUser().clan.id
        )
    }

    res.render('clans/accept_invite', {
        acceptURL: `/clans/join?token=${token}`,
        clanName: decodedToken.clan.name,
    })
}
