const request = require('request');

exports = module.exports = function(req, res) {

    const maxDescriptionLength = 48;

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'account';
	locals.formData = req.body || {};
    locals.game_id = req.query.game_id; // Game_id can be supplied as GET
    locals.offenders_names = []; // Offender name aswell
    
    if (req.query.offenders != undefined){
        locals.offenders_names = req.query.offenders.split(" ");
    }
    
    var fs = require('fs');



    var flash = null;

    if (req.originalUrl == '/report_submitted') {
        flash = {};

        flash.class = 'alert-success';
        flash.messages = [{msg: 'You have successfully submitted your report'}];
        flash.type = 'Success!';
    }
    else if (req.query.flash){
        let buff = Buffer.from(req.query.flash, 'base64');  
        let text = buff.toString('ascii');
        flash = JSON.parse(text);
    }
    
    
    request.get(
        {
            url: process.env.API_URL + '/data/moderationReport?include=reportedUsers,lastModerator&sort=-createTime',
            headers: {
                'Authorization': 'Bearer ' + req.user.data.attributes.token
            }
        },
        function (err, childRes, body) {
            const reports = JSON.parse(body);
            locals.reports = [];
            for (k in reports.data){
                const report = reports.data[k];

                let offenders = [];
                for (l in report.relationships.reportedUsers.data){
                    const offender = report.relationships.reportedUsers.data[l];
                    for (m in reports.included){
                        const user = reports.included[m];
                        if (user.type === "player" && user.id === offender.id){
                            offenders.push (user.attributes.login);
                        }
                    }
                }

                let moderator = '';
                if (report.relationships.lastModerator.data){
                    for (l in reports.included){
                        const user = reports.included[l];
                        if (user.type == "player" && user.id == report.relationships.lastModerator.data.id){
                            moderator = user.attributes.login;
                            break;
                        }
                    }
                }

                let statusStyle = {};
                switch (report.attributes.reportStatus){
                    case "AWAITING":
                        statusStyle = {'color':'#806A15', 'background-color':'#FAD147'};
                    break;
                    case "PROCESSING":
                        statusStyle = {'color':'#213A4D', 'background-color':'#3A85BF'};
                    break;
                    case "COMPLETED":
                        statusStyle = {'color':'green', 'background-color':'lightgreen'};
                    break;
                    case "DISCARDED":
                        statusStyle = {'color':'#444444', 'background-color':'#AAAAAA'};
                    break;
                }
                statusStyle['font-weight'] = 'bold';

                locals.reports.push({
                    'id':report.id,
                    'offenders':offenders.join(" "),
                    'creationTime':report.attributes.createTime,
                    'game': report.relationships.game.data != null ? '#'+report.relationships.game.data.id : '',
                    'lastModerator': moderator,
                    'description':report.attributes.reportDescription.substr(0,maxDescriptionLength)+(report.attributes.reportDescription.length>maxDescriptionLength?'...':''),
                    'notice':report.attributes.moderatorNotice,
                    'status':report.attributes.reportStatus,
                    'statusStyle':statusStyle
                });
            }
            
            fs.readFile('members/recent.json', 'utf8', function (err, data) {
                try{
                    locals.reportable_members = JSON.parse(data);
                }
                catch(e){
                    const moment = require('moment');
                    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + "The list of reportable members could not be read from the disk: "+e.toString());
                }
                
                res.render('account/report', {flash: flash});
            });
        }
    )
};
