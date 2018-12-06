const express = require('express');
const router = express.Router();
const request = require('request');

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

/* GET AA page. */
router.get('/', function(req, res, next) {
  let endpoint = 'http://localhost:3000/endpoints/aa/48/2';
  let markers = '';

  request(endpoint,function (err, response, body) {
    if(err) {
      res.render('aa',  {title: 'AA Interface', hours: '48', miles: '2', test: "console.log('Error')"})
    } else {
      let aaMeetings = JSON.parse(body);
      for (let a=0;a<aaMeetings.length;a++) {
        let meeting = aaMeetings[a];
        let lat = meeting.lat;
        let lon = meeting.lon;
        // console.log("console.log('Error')");
        markers += "L.marker(["+lat+", "+lon+"]).addTo(map);";
      }
      console.log(consolePrint);
      res.render('aa', {title: 'AA Interface', hours: '48', miles: '2', test: markers})
    }
  });
});

router.post('/', function(req, res) {
  let hours = req.body.hours;
  let miles = req.body.miles;
  console.log(miles);
  if (hours == null) { hours = 48;};
  if (miles == null) { miles = 2;};
  let endpoint = 'http://localhost:3000/endpoints/aa/' + hours + '/' + miles + '';
  let markers = '';
  //
  request(endpoint,function (err, response, body) {
    if(err) {
      res.render('aa',  {title: 'AA Interface', hours: '48', miles: '2', test: "console.log('Error')"})
    } else {
      let aaMeetings = JSON.parse(body);
      for (let a=0;a<aaMeetings.length;a++) {
        let meeting = aaMeetings[a];
        let lat = meeting.lat;
        let lon = meeting.lon;
        // console.log("console.log('Error')");
        markers += "L.marker(["+lat+", "+lon+"]).addTo(map);";
      }
      res.render('aa', {title: 'AA Interface', hours: hours, miles: miles, test: markers})
    }
  });
});

module.exports = router;
