const { Client } = require('pg');
const async = require('async');

// AWS RDS POSTGRESQL INSTANCE
const client = new Client({
  user: 'ryanabest',
  host: 'datastructures.cbijimkrmieh.us-east-1.rds.amazonaws.com',
  database: 'datastructures',
  password: process.env.AWS_PW,
  port: 5432,
})

init();

function init() {
  client.connect();
  // helloWorld();
  let queries = createQueries();
  // let queries = dropQueries();
  // let queries = deleteQuery('factMeetingSchedule');
  runQuery(client,queries);

  // let fileNumber = 'm08';
  // let dimGeoLocation = require('../data/'+fileNumber+'_dimGeoLocation.json');
  // let dimLocation = require('../data/'+fileNumber+'_dimLocation.json');
  // let dimMeeting = require('../data/'+fileNumber+'_dimMeeting.json');
  // let factMeetingSchedule = require('../data/'+fileNumber+'_factMeetingSchedule.json')
  // getAllMaxLengths(dimGeoLocation);
}

// Hello World
function helloWorld() {
  console.log(process.env.AWS_PW);
  client.query('SELECT NOW() as now', (err,res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res)
    }
    client.end();
  });
}

function createQueries() {
  let queries = '';

  // geoLocationID :  0
  // formattedAddress :  57
  // lat :  0
  // lon :  0
  queries += `
    CREATE TABLE dimGeolocation
    (
       geoLocationID int
      ,formattedAddress varchar(100)
      ,lat double precision
      ,lon double precision);
  `;

  // longest character lengths:
  // locationName: 46
  // locationAddress: 30
  // locationAddressDetail: 67
  queries += `
    CREATE TABLE dimLocation
    (
       locationID int
      ,locationName varchar(100)
      ,locationAddress varchar(100)
      ,locationAddressDetail varchar(100)
    );
  `;

  // longest character lengths:
  // meetingName: 38
  // meetingSubName: 38
  // meetingDetails: 94
  queries += `
    CREATE TABLE dimMeeting
    (
       meetingID int
      ,meetingName varchar(100)
      ,meetingSubName varchar(100)
      ,meetingDetails varchar(150)
    );
  `;

  // longest character lengths:
  // meetingDay: 10
  // meetingStartTime: 8
  // meetingEndTime: 8
  // meetingType: 29
  // meetingSpecialInterest: 17

  queries += `CREATE TABLE factMeetingSchedule
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
  `;

  return queries;
}

function dropQueries() {
  let queries = '';
  queries += 'DROP TABLE dimGeolocation;'
  queries += 'DROP TABLE dimLocation;'
  queries += 'DROP TABLE dimMeeting;'
  queries += 'DROP TABLE factMeetingSchedule;'
  return queries;
}

function runQuery(client,query) {
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res);
      client.end();
    }
  });
}

function getMaxLength (table,column) {
  let charLength = 0
  for (let i=0;i<table.length;i++) {
    if (table[i][column].length > charLength) {
      charLength = table[i][column].length;
    }
  };
  return charLength;
}

function getAllMaxLengths(table) {
  for (let k=0;k<Object.keys(table[0]).length;k++) {
    let column = Object.keys(table[0])[k];
    console.log(column,': ',getMaxLength(table,column));
  }
}

function deleteQuery(table) {
  queries = 'DELETE FROM ' + table + ';';
  return queries
}
