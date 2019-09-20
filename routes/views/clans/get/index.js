exports = module.exports = function(req, res) {

    let locals = res.locals;
    
    // Render the view
    res.render('clans/index');
};
