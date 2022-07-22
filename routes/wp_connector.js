let WP = require( 'wpapi' );
module.exports = {
    connect: function () { return new WP({ endpoint: process.env.WP_URL });}
};
