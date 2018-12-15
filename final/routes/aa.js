const express = require('express');
const router = express.Router();
const { Client } = require('pg');
const defaultHours = 48;
const defaultMiles = 2;

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

  // Set default view : 48 hours and 2 miles from Parsons
  // TO DO: ADD LOCATION SEARCH AND MEETING TYPE LIST
  let hours = defaultHours;
  let miles = defaultMiles;
  let query = aaQuery(hours,miles);

  let client = createClient();
  client.connect();
  client.query(query, (err, qres) => {
    if (err) { throw (err) } // what do I want to do with error handling here?
    else {
      let markers = ''; // this will be the JS code that will create all my individual markers
      let aaMeetings = qres.rows; // this should be a list that returns one row per geoLocation
      client.end();
      for (let a=0;a<aaMeetings.length;a++) {
        let meeting = aaMeetings[a];
        markers += 'mapMarkers.push('+JSON.stringify(aaMeetings[a])+');'
      }
      res.render('aa', {title: 'AA Interface', hours: hours, miles: miles, markers: markers})
      console.log("Responded to AA request for meetings in next " + hours + " hours");
    }
  });
});

router.post('/', function(req, res) {
  // set hours and miles to user input after initial load of the page
  // if users haven't entered or changes these values, then refer to defaults listed above
  let hours = req.body.hours;
  let miles = req.body.miles;
  if (hours == null) { hours = defaultHours;};
  if (miles == null) { miles = defaultMiles;};
  let query = aaQuery(hours,miles);

  let client = createClient();
  client.connect();
  client.query(query, (err, qres) => {
    if (err) { throw (err) } // what do I want to do with error handling here?
    else {
      let markers = ''; // this will be the JS code that will create all my individual markers
      let aaMeetings = qres.rows; // this should be a list that returns one row per geoLocation
      client.end();
      for (let a=0;a<aaMeetings.length;a++) {
        let meeting = aaMeetings[a];
        markers += 'mapMarkers.push('+JSON.stringify(aaMeetings[a])+');'
      }
      res.render('aa', {title: 'AA Interface', hours: hours, miles: miles, markers: markers})
      console.log("Responded to AA request for meetings in next " + hours + " hours");
    }
  });
});

module.exports = router;

function aaQuery(hours,miles) {
  let query = `
  WITH TODAY as (
    SELECT
       TRIM(UPPER(to_char(the_day, 'day'))) as day
      ,min(date_trunc('minute',the_day)::time) as earliest_time
      ,max(date_trunc('minute',the_day)::time) as latest_time
    FROM generate_series(CURRENT_TIMESTAMP
                       ,CURRENT_TIMESTAMP + INTERVAL '`+hours+` hours'
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
    SELECT *, lldistance(m.lat,m.lon,40.7354868,-73.9935562) as lldistance
    FROM MEETINGS m
    JOIN TODAY t
      ON UPPER(m.meetingday) LIKE '%'||t.day||'%'
      AND t.earliest_time <= m.meetingstarttime_raw
      AND t.latest_time >= m.meetingstarttime_raw
    WHERE lldistance(m.lat,m.lon,40.7354868,-73.9935562) <= `+miles+`
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
  return query;
}
