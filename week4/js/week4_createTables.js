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
  // let queries = createQueries();
  // let queries = dropQueries();
  let queries = deleteQueries();
  // let queries = deleteQuery('dimGeolocation');
  runQuery(client,queries);

  // let fileNumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10'];
  // for (let f=0;f<fileNumbers.length;f++) {
  //   let fileNumber = fileNumbers[f];
  //   let dir = '../../data/'+fileNumber;
  //   let dimGeoLocation = require(dir+'/'+fileNumber+'_dimGeoLocation.json');
  //   let dimLocation = require(dir+'/'+fileNumber+'_dimLocation.json');
  //   let dimMeeting = require(dir+'/'+fileNumber+'_dimMeeting.json');
  //   let factMeetingSchedule = require(dir+'/'+fileNumber+'_factMeetingSchedule.json')
  //   console.log(fileNumber);
  //   getAllMaxLengths(factMeetingSchedule);
  // }
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

  queries += `
    CREATE TABLE dimGeolocation
    (
       geoLocationID int
      ,formattedAddress varchar(100)
      ,lat double precision
      ,lon double precision);
  `;


  queries += `
    CREATE TABLE dimLocation
    (
       locationID int
      ,locationName varchar(100)
      ,locationAddress varchar(100)
      ,locationAddressDetail varchar(100)
    );
  `;


  queries += `
    CREATE TABLE dimMeeting
    (
       meetingID int
      ,meetingName varchar(100)
      ,meetingSubName varchar(100)
      ,meetingDetails varchar(250)
    );
  `;

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

function deleteQueries() {
  let queries = '';
  queries += 'DELETE FROM dimGeolocation;'
  queries += 'DELETE FROM dimLocation;'
  queries += 'DELETE FROM dimMeeting;'
  queries += 'DELETE FROM factMeetingSchedule;'
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
