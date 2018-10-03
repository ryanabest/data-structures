const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'ryanabest';
db_credentials.host = 'datastructures.cbijimkrmieh.us-east-1.rds.amazonaws.com';
db_credentials.database = 'datastructures';
db_credentials.password = process.env.AWS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

let queries = [];

/*
// Query structure for checking maximum column lengths
let fileNumber = 'm08';
let dimGeoLocation = require('../data/'+fileNumber+'_dimGeoLocation.json');
let dimLocation = require('../data/'+fileNumber+'_dimLocation.json');
let dimMeeting = require('../data/'+fileNumber+'_dimMeeting.json');
let factMeetingSchedule = require('../data/'+fileNumber+'_factMeetingSchedule.json')

let charLength = 0
for (let i=0;i<factMeetingSchedule.length;i++) {
  if (factMeetingSchedule[i].meetingSpecialInterest.length > charLength) {
    charLength = factMeetingSchedule[i].meetingSpecialInterest.length;
  }
};
console.log(charLength)
*/

queries.push("CREATE TABLE dimgeolocation (geoLocationID int, lat double precision, lon double precision);");

// longest character lengths:
// locationName: 46
// locationAddress: 30
// locationAddressDetail: 67
queries.push(`
  CREATE TABLE dimLocation
  (
     locationID int
    ,locationName varchar(100)
    ,locationAddress varchar(100)
    ,locationAddressDetail varchar(100)
  );
`);

// longest character lengths:
// meetingName: 38
// meetingSubName: 38
// meetingDetails: 94
queries.push(`
  CREATE TABLE dimMeeting
  (
     meetingID int
    ,meetingName varchar(100)
    ,meetingSubName varchar(100)
    ,meetingDetails varchar(150)
  );
`);

// longest character lengths:
// meetingDay: 10
// meetingStartTime: 8
// meetingEndTime: 8
// meetingType: 29
// meetingSpecialInterest: 17

queries.push(`CREATE TABLE factMeetingSchedule
  (
     geoLocationID int
    ,locationID int
    ,meetingID int
    ,meetingDay varchar(100)
    ,meetingStartTime varchar(100)
    ,meetingEndTime varchar(100)
    ,meetingType varchar(100)
    ,meetingSpecialInterest varchar(100)
  );
`);


// client.query('SELECT NOW() as now', (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//   }
// })

for (let q=0;q<queries.length;q++) {
  client.query(queries[q], (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res)
    }
  });
  client.end();
}

// client.query(thisQuery, (err, res) => {
//     console.log(err, res);
//     client.end();
// });
