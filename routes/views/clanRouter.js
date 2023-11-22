const express = require('express');
const router = express.Router();

// This will be replaced soon, therefor I did not spend time on it
router.get('*',  (req, res) =>  res.status(503).render('errors/503-known-issue'));

module.exports = router
