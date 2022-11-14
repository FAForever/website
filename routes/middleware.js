/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
const express = require('express');
const fs = require('fs');
const app = express();
exports.initLocals = function(req, res, next) {
	let locals = res.locals;
	locals.navLinks = [];
  locals.cNavLinks = [];
  next();
};
exports.getLatestClientRelease = function(req, res, next) {

	let locals = res.locals;
    const fs = require('fs');
    let clientLink;
    let exec = require('child_process').exec;

    fs.readFile('link.json', 'utf8', function (err, data) {
        try {
            clientLink = JSON.parse(data);
        } catch (e) {
            exec('node scripts/getLatestClientRelease.js');
            clientLink = {};
            clientLink.fafClientLink = 'https://github.com/FAForever/downlords-faf-client/releases';
        }
        locals.fafClientDownloadLink = clientLink.fafClientLink;
        next();
	});
};

exports.clientChecks = function(req, res, next) {
    let locals = res.locals;
    locals.removeNavigation = false;
 
    let userAgent = req.headers['user-agent'];
    if (userAgent === 'downlords-faf-client') {
        locals.removeNavigation = true;
    }
    next();
};

exports.username = function(req, res, next) {
  var locals = res.locals;

  if (req.isAuthenticated()) {
    locals.username = req.user.data.attributes.userName;
    locals.hasClan =
      req.user && req.user.data.attributes.clan;
  }

  next();
};

exports.flashMessage =  function(req, res, next) {
  let rawData = fs.readFileSync('./public/js/app/members/flashMessage.json') ;
  let data = JSON.parse(rawData);
  let {valid, content, color, pages} = data[0];
  
  let locals = res.locals;
  //String 'true' because the wordpress value comes in a string
  if (valid === 'true') {
    locals.flashMessage = content;
    locals.flashColor = color;
    locals.flashRoutes = pages.slice(1,-1);
   
    
  } 
  next();
};
