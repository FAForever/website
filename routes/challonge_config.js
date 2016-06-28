module.exports = {
    getAuth: function () {
        return "https://" + process.env.CHALLONGE_USERNAME + ":" + process.env.CHALLONGE_APIKEY + "@api.challonge.com/v1";
    }
};