sexports = module.exports = [
    async function (req, res) {
        try {
            await req.services.clanService.deleteClan(req.user.clan.id)
            return res.redirect('/')
        } catch (e) {
            res.redirect('manage?flash=error')
        }
    }
]
