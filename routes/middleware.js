/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {

	var locals = res.locals;

	locals.navLinks = [
		{ label: 'News',		key: 'blog',		href: '/news' },
		{ label: 'Competitive',		key: 'competitive',		href: '/competitive/tournaments' }
	];

	locals.cNavLinks = [
		{ label: 'Tournaments',		key: 'tournaments',		href: '/competitive/tournaments' },
		{ label: 'Leaderboards',		key: 'leaderboards',		href: '/competitive/leaderboards' }
	];

	next();

});