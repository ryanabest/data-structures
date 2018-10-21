const { Client } = require('pg');
const async = require('async');

// AWS RDS POSTGRESQL INSTANCE

init();

function init() {
  // helloWorld();
  loadTables();
}

function loadTables() {
  // If this runs correctly, I will just need to run the first script
  // Each subsequent script is included in the callback for the previous, so there will be a chain of running each script
  let fileNumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10']
  for (let f=0;f<fileNumbers.length;f++) {
    let fileNumber = fileNumbers[f];
    loadDimGeoLocation(fileNumber);
  }
  // let fileNumber = fileNumbers[0];
  // loadDimGeoLocation(fileNumber);
  // loadDimLocation(fileNumber);
  // loadDimMeeting(fileNumber);
  // loadFactMeetingSchedule(fileNumber);
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

// Hello World
function helloWorld() {
  console.log(process.env.AWS_PW);
  runQuery('SELECT NOW() as now');
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

function loadDimGeoLocation(fileNumber) {
  let dir = '../data/'+fileNumber;
  let dimGeoLocation = require(dir+'/'+fileNumber+'_dimGeoLocation.json');
  async.eachSeries(dimGeoLocation, function(row,callback) {
    let query = `
      INSERT INTO dimGeoLocation VALUES
      (
         ` + row.geoLocationID + `
        ,E'` + row.formattedAddress.replace("'","''") + `'
        ,` + row.lat + `
        ,` + row.lon + `
      );
    `;
    runQuery(query);
    // console.log(query);
    setTimeout(callback,1000);
  }, function() {
    console.log('*************************************');
    console.log('finished dimGeoLocation');
    console.log('*************************************');
    console.log('starting dimLocation');
    console.log('*************************************');
    loadDimLocation(fileNumber);
  });
}

function loadDimLocation(fileNumber) {
  let dir = '../data/'+fileNumber;
  // apostrophes are apparently an issue, so I will need to replace ' with ''
  // https://stackoverflow.com/questions/12316953/insert-text-with-single-quotes-in-postgresql
  let dimLocation = require(dir+'/'+fileNumber+'_dimLocation.json');
  async.eachSeries(dimLocation, function(row,callback) {
    let query = `
      INSERT INTO dimLocation VALUES
      (
         ` + row.locationID + `
        ,'` + row.locationName.replace("'","''") + `'
        ,'` + row.locationAddress.replace("'","''") + `'
        ,'` + row.locationAddressDetail.replace("'","''") + `'
      );
    `;
    runQuery(query);
    // console.log(query);
    setTimeout(callback,1000);
  }, function() {
    console.log('*************************************');
    console.log('finished dimLocation');
    console.log('*************************************');
    console.log('starting dimMeeting');
    console.log('*************************************');
    loadDimMeeting(fileNumber);
  });
}

function loadDimMeeting(fileNumber) {
  let dir = '../data/'+fileNumber;
  let dimMeeting = require(dir+'/'+fileNumber+'_dimMeeting.json');
  async.eachSeries(dimMeeting, function(row,callback) {
    let query = `
      INSERT INTO dimMeeting VALUES
      (
         ` + row.meetingID + `
        ,'` + row.meetingName.replace("'","''") + `'
        ,'` + row.meetingSubName.replace("'","''") + `'
        ,E'` + row.meetingDetails.replace("'","''") + `'
      );
    `;
    runQuery(query);
    // console.log(query);
    setTimeout(callback,1000);
  }, function() {
    console.log('*************************************');
    console.log('finished dimMeeting');
    console.log('*************************************');
    console.log('starting factMeetingSchedule');
    console.log('*************************************');
    loadFactMeetingSchedule(fileNumber);
  });
}

function loadFactMeetingSchedule(fileNumber) {
  let dir = '../data/'+fileNumber;
  let factMeetingSchedule = require(dir+'/'+fileNumber+'_factMeetingSchedule.json')
  async.eachSeries(factMeetingSchedule, function(row,callback) {
    let query = `
      INSERT INTO factMeetingSchedule VALUES
      (
         ` + row.geoLocationID + `
        ,` + row.locationID + `
        ,` + row.meetingID + `
        ,'` + row.meetingDay.replace("'","''") + `'
        ,'` + row.meetingStartTime.replace("'","''") + `'
        ,'` + row.meetingEndTime.replace("'","''") + `'
        ,'` + row.meetingType.replace("'","''") + `'
        ,'` + row.meetingSpecialInterest.replace("'","''") + `'
      );
    `;
    runQuery(query);
    // console.log(query);
    setTimeout(callback,1000);
  }, function() {
    console.log('*************************************');
    console.log('finished factMeetingSchedule');
    console.log('*************************************');
    return;
  });
}
