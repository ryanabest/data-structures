const { Client } = require('pg');
const async = require('async');

init();

function init() {
  let insertQuery = `
    INSERT INTO dimGeoLocation VALUES
    (
       ` + '638' + `
      ,E'` + '165 W 105th St, New York, NY 10025, USA' + `'
      ,` + '40.7997898' + `
      ,` + '-73.96562399999999' + `
    );
  `;

  let updateQuery = `
    UPDATE factMeetingSchedule
    SET geolocationid = 638
    WHERE geolocationid = 99999;
  `
  runQuery(updateQuery);
}

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

function runQuery(query) {
  const client = createClient();
  client.connect();
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res.rowCount);
      client.end();
    }
  });
}
