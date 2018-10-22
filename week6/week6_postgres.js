const { Client } = require('pg');
const cTable = require('console.table');

init();

function init() {
  let postgresqlQuery = `
  --SET TIMEZONE TO 'US/Eastern'

  WITH TODAY as (
    SELECT
       now() AT TIME ZONE 'UTC+4' as now
      ,TRIM(UPPER(to_char(current_date, 'day'))) as day
      ,date_part('hour', NOW() AT TIME ZONE 'UTC+4') as hour
      ,date_part('minute', NOW() AT TIME ZONE 'UTC+4') as min
      ,to_char(now() AT TIME ZONE 'UTC+4','HH24:mi:SS')::timetz as time
      --,now()::time
    )

  , MEETINGS as (
   SELECT
      f.meetingday
     ,(RIGHT('0' || date_part('hour',f.meetingstarttime::time)::int,2) || ':' || RIGHT('0' || date_part('minute',f.meetingstarttime::time),2) || ':00')::time as meetingstarttime
     ,date_part('hour',f.meetingstarttime::time)::int as meetingStartHour
     ,date_part('minute',f.meetingstarttime::time)::int as meetingStartMin
     ,(RIGHT('0' || date_part('hour',f.meetingendtime::time)::int,2) || ':' || RIGHT('0' || date_part('minute',f.meetingendtime::time),2) || ':00')::time as meetingendtime
     ,date_part('hour',f.meetingendtime::time)::int as meetingEndHour
     ,date_part('minute',f.meetingendtime::time)::int as meetingEndMin
     ,f.meetingtype
     ,f.meetingSpecialInterest
     ,l.*
     ,g.*
     ,m.*
   FROM public.factMeetingSchedule f
   JOIN dimLocation l
      ON f.locationid = l.locationid
   JOIN dimGeoLocation g
      ON f.geolocationid = g.geolocationid
   JOIN dimMeeting m
      ON f.meetingID = m.meetingID
  )

  SELECT DISTINCT
    m.formattedaddress
   ,m.lat
   ,m.lon
  FROM MEETINGS m
  JOIN TODAY t
  ON UPPER(m.meetingday) LIKE '%'||t.day||'%'
  AND t.time <= m.meetingstarttime
  AND t.time <= m.meetingendtime;
  `
  runQuery(postgresqlQuery);
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

function helloWorld() {
  console.log(process.env.AWS_PW);
  runQuery("select UPPER(to_char(current_date, 'day'))");
}

function runQuery(query) {
  const client = createClient();
  client.connect();
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
      client.end();
    } else {
      // console.log(res);
      console.table(res.rows);
      client.end();
    }
  });
}
