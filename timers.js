var	exec = require('child_process').exec;

/**
 * These are cron jobs that will be ran every 15 and 60 minutes to grab the latest client 
 * release and the latest ladder 1v1 and global ratings.
 */

setInterval(function() {
	//  I will run for every 15 minutes
	exec('node scripts/getLatestClientRelease.js', function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		if (error !== null) {
			console.log(error);
		}
	});
}, 15 * 60 * 1000);

setInterval(function() {
	//  I will run for every hour
	exec('node scripts/extractor.js', function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		if (error !== null) {
			console.log(error);
		}
	});
}, 60 * 60 * 1000);
