var express = require('express');
var router = express.Router();

const { Client } = require('pg');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , body:
  `
  <a href="/endpoints"><h1>Endpoints</h1></a>
  <h1>Front-End Visualizations</h1>
  <ul>
    <li><a href="/aa">AA Meetings</a></li>
  </ul>
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
