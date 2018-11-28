var express = require('express');
var router = express.Router();

const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DS2018 - Ryan Best' , body:
  `
  <a href="/endpoints"><h1>Endpoints</h1></a>
  <a href="/aa"><h1>AA Meetings</h1></a>
  <a href="/diary"><h1>Dear Diary</h1></a>
  <a href="/sensor"><h1>Sensor</h1></a>
  `});
});

/* GET AA page. */
router.get('/aa', function(req, res, next) {
  response = {
            hours : req.query.hours
            };
  next()
}, function(req, res, next) {});

// AWS Connection
function createClient() {
  const client = new Client({
    user: 'ryanabest',
    host: 'datastructures.cbijimkrmieh.us-east-1.rds.amazonaws.com',
    database: 'datastructures',
    password: process.env.AWS_PW,
    port: 5432,
  });

  return client;
}

module.exports = router;
