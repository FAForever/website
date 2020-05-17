exports = module.exports = function(req, res) {

	var locals = res.locals;
    var fs = require('fs');

	// locals.section is used to set the currently selected
	// item in the header navigation.  
	locals.section = 'news';
	locals.title = 'FAForever Newshub';

    fs.readFile('newshubdata/newshub.json', 'utf8', function (err, data) {
        if(err) return;
        locals.content = JSON.parse(data);

        // Render the view
        res.render('newshub');
	});

};
