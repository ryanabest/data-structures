var express = require('express');
var router = express.Router();

const { Client } = require('pg');

// AWS RDS Connection
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

/* GET endpoints */
router.get('/', function(req, res, next) {
  res.render('endpoints', { title: 'DS2018 Endpoints - Ryan Best' , body:
  `
  <h1>Endpoints</h1>
  <a href="/endpoints/aa"><h1>AA Meetings</h1></a>
  <a href="/endpoints/diary"><h1>Dear Diary</h1></a>
  <a href="/endpoints/sensor"><h1>Sensor Data</h1></a>
  `});
});

// AA Endpoint
router.get('/aa', function(req, res, next) {
  let query = `
  WITH TODAY as (
    SELECT
       TRIM(UPPER(to_char(the_day, 'day'))) as day
      ,min(date_trunc('minute',the_day)::time) as earliest_time
      ,max(date_trunc('minute',the_day)::time) as latest_time
    FROM generate_series(CURRENT_TIMESTAMP
                       ,CURRENT_TIMESTAMP + INTERVAL '48 hours'
                       , interval  '1 minute') the_day
    GROUP BY TRIM(UPPER(to_char(the_day, 'day')))
    )

    , MEETINGS as (
     SELECT
        f.meetingday
       ,(RIGHT('0' || date_part('hour',f.meetingstarttime::time)::int,2) || ':' || RIGHT('0' || date_part('minute',f.meetingstarttime::time),2) || ':00')::time as meetingstarttime_raw
       -- ,date_part('hour',f.meetingstarttime::time)::int as meetingStartHour
       -- ,date_part('minute',f.meetingstarttime::time)::int as meetingStartMin
       ,(RIGHT('0' || date_part('hour',f.meetingendtime::time)::int,2) || ':' || RIGHT('0' || date_part('minute',f.meetingendtime::time),2) || ':00')::time as meetingendtime_raw
       -- ,date_part('hour',f.meetingendtime::time)::int as meetingEndHour
       -- ,date_part('minute',f.meetingendtime::time)::int as meetingEndMin
       ,split_part(f.meetingtype,' = ',2) as meetingtype
       ,f.meetingSpecialInterest
       ,f.meetingstarttime
       ,f.meetingendtime
       ,l.*
       ,g.*
       ,m.meetingid
       ,REPLACE(initcap(m.meetingname),'''S','''s') as meetingname
       ,m.meetingsubname
       ,m.meetingdetails
     FROM public.factMeetingSchedule f
     JOIN dimLocation l
        ON f.locationid = l.locationid
     JOIN dimGeoLocation g
        ON f.geolocationid = g.geolocationid
     JOIN dimMeeting m
        ON f.meetingID = m.meetingID
    )

    , TODAYS_MEETINGS as (
    SELECT *, lldistance(m.lat,m.lon,40.7353003,-73.9967813) as lldistance
    FROM MEETINGS m
    JOIN TODAY t
      ON UPPER(m.meetingday) LIKE '%'||t.day||'%'
      AND t.earliest_time <= m.meetingstarttime_raw
      AND t.latest_time >= m.meetingstarttime_raw
    WHERE lldistance(m.lat,m.lon,40.7353003,-73.9967813) <= 2
    )

    , TODAYS_MEETING_SCHEDULE as (
    SELECT
      geolocationid
     ,formattedaddress
     ,lat
     ,lon
     ,lldistance
     ,locationid
     ,locationname
     ,locationaddress
     ,locationaddressdetail
     ,meetingid
     ,case when UPPER(meetingname) = UPPER(meetingsubname) OR meetingsubname = '' then meetingname else CONCAT(meetingname,': ',meetingsubname) end as meetingname
     ,meetingdetails
     ,json_agg(json_build_object('meeting_day',meetingday,'meeting_starttime',meetingstarttime,'meeting_endtime',meetingendtime,'meeting_type',meetingtype,'meeting_specialinterest',meetingspecialinterest)) as schedule_json
     --,array_agg(DISTINCT locationid) as locationid_list
     --,array_agg(DISTINCT meetingid) as meetingid_list
    FROM TODAYS_MEETINGS
    GROUP BY geolocationid,formattedaddress,lat,lon,lldistance,locationid,locationname,locationaddress,locationaddressdetail,meetingid,meetingname,meetingsubname,meetingdetails
    ORDER BY lldistance ASC
     )

     ,TODAYS_MEETING_LOCATION as (
     SELECT
        geolocationid
       ,formattedaddress
       ,lat
       ,lon
       ,lldistance
       ,locationid
       ,locationname
       ,locationaddress
       ,locationaddressdetail
       ,json_agg(json_build_object('meeting_id',meetingid,'meeting_name',meetingname,'meeting_details',meetingdetails,'schedule',schedule_json)) as meetings_json
     FROM TODAYS_MEETING_SCHEDULE
     GROUP BY geolocationid,formattedaddress,lat,lon,lldistance,locationid,locationname,locationaddress,locationaddressdetail
     ORDER BY lldistance ASC
     )

     ,TODAYS_MEETING_GEOLOCATION as (
     SELECT
        geolocationid
       ,formattedaddress
       ,lat
       ,lon
       ,lldistance
       ,json_agg(json_build_object('location_id',locationid,'location_name',locationname,'location_address',locationaddress,'location_addressdetail',locationaddressdetail,'meetings',meetings_json)) as locations_json
     FROM TODAYS_MEETING_LOCATION
     GROUP BY geolocationid,formattedaddress,lat,lon,lldistance
     ORDER BY lldistance ASC
     )

    SELECT
    *
    FROM TODAYS_MEETING_GEOLOCATION
  `

  const client = createClient();
  client.connect();
  client.query(query, (err, qres) => {
    if (err) { throw (err) }
    else {
      res.send(qres.rows);
      client.end();
      console.log("Responded to AA request");
    }
  });
})

// Diary Endpoint
router.get('/diary', function(req, res, next) {
  // AWS Dynamo
  const AWS = require('aws-sdk');
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.AWS_ID;
  AWS.config.secretAccessKey = process.env.AWS_KEY;
  AWS.config.region = "us-east-1";
  const dynamodb = new AWS.DynamoDB();

  // DynamoDB (NoSQL) query
  let params = {
      TableName : "deardiary_viz",
      KeyConditionExpression: `
        #typ = :topicName
        and #dt between :minDate and :maxDate`, // the query expression
      ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
          "#typ" : "type",
          "#dt"  : "date"
      },
      ExpressionAttributeValues: { // the query values
          ":topicName": {S: "interactive viz"},
          ":minDate": {S: new Date("October 1, 2018").toLocaleDateString()},
          ":maxDate": {S: new Date("December 31, 2018").toLocaleDateString()}
      }
  };

  dynamodb.query(params, function(err, data) {
      if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      }
      else {
          res.send(data.Items);
          console.log('Responded to Diary Request');
      }
  });
})

// Sensor Endpoint
router.get('/sensor', function(req, res, next) {
  let testQuery = `select NOW() as now`
  let query = `
  WITH AVG_HOUR as (
    SELECT date_part('hour',datetime) as darksky_hour, count(*) as darksky_count, avg(temperature) as darksky_temp_avg
    FROM darksky_hour
    GROUP BY 1 ORDER BY 1
    )

    , DATES as (
    SELECT
      DISTINCT date_trunc('day',p.last_heard) as day
      ,d.hour - 1 as hour
      ,date_trunc('day',p.last_heard) + interval '1h' * (d.hour-1) as date_stamp
    FROM particle_temperature p
    JOIN (SELECT ROW_NUMBER() OVER () as hour
    FROM particle_temperature
    LIMIT 24) d
      ON (1=1))

    , AVERAGES as (
    SELECT * FROM (
    SELECT date_trunc('hour',last_heard) as trunc_hour, date_trunc('day',last_heard) as day, date_part('hour',last_heard) as hour, COUNT(*) as count, avg(result) as avg_temp
    from particle_temperature
    group by 1,2,3 ) A WHERE COUNT >= 20 )

    , AVERAGES_STEPS as (
    SELECT
       *
      ,trunc_hour - interval '1h' * COALESCE((date_part('hour',trunc_hour - LAG(trunc_hour,1) OVER ())-1),0) as start_trunc_hour
      ,COALESCE(date_part('hour',trunc_hour - LAG(trunc_hour,1) OVER ()),1) as hours_to_next_reading
      ,COALESCE((LAG(avg_temp,1) over () - avg_temp) / date_part('hour',trunc_hour - LAG(trunc_hour,1) OVER ()),0) avg_increase
    FROM AVERAGES
    )


    , DARKSKY as (
      select
         date_trunc('day',datetime) as day
        ,date_part('hour',datetime) as hour
        ,temperature
      from darksky_hour
    )

    , HOURLY as (
      SELECT
         d.day
        ,d.hour
        ,d.date_stamp as date_stamp
        ,a.avg_temp + (a.avg_increase * CASE WHEN d.date_stamp = a.trunc_hour THEN 0 ELSE a.hours_to_next_reading + date_part('hour',d.date_stamp - a.trunc_hour) END) as inside_temp
        ,y.temperature as outside_temp
        ,CASE WHEN d.date_stamp = a.trunc_hour THEN 0 ELSE a.hours_to_next_reading + date_part('hour',d.date_stamp - a.trunc_hour) END as multiplier
        ,a.avg_increase
        ,CASE WHEN d.date_stamp = a.trunc_hour THEN 0 ELSE 1 end as estimated
      FROM DATES d
      LEFT JOIN AVERAGES_STEPS a
        ON d.date_stamp between a.start_trunc_hour and a.trunc_hour
      LEFT JOIN DARKSKY y
        ON  d.day = y.day
        AND d.hour = y.hour
      ORDER BY d.day ASC
    )

    SELECT
       day
      ,hour
      ,date_stamp
      ,inside_temp
      ,outside_temp
      ,inside_temp - outside_temp as temp_diff
      ,multiplier
      ,avg_increase
      ,estimated
    FROM HOURLY;
  `

  const client = createClient();
  client.connect();
  client.query(query, (err, qres) => {
    if (err) { throw (err) }
    else {
      res.send(qres.rows);
      client.end();
      console.log("Responded to Sensor request");
    }
  });
})

module.exports = router;
