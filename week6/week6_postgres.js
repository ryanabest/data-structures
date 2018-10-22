const { Client } = require('pg');
const cTable = require('console.table');

init();

function init() {
  let postgresqlQuery = `
  WITH TODAY as (
    SELECT
       now() as now
      ,TRIM(UPPER(to_char(current_date, 'day'))) as day
      ,date_part('hour', NOW()) as hour
      ,date_part('minute', NOW()) as min
    )

    , MEETINGS as (
     SELECT
        f.meetingday
       ,f.meetingstarttime
       ,date_part('hour',f.meetingstarttime::time)::int as meetingStartHour
       ,date_part('minute',f.meetingstarttime::time)::int as meetingStartMin
       ,f.meetingendtime
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
    AND m.meetingstarthour >= t.hour
    AND m.meetingendhour <= t.hour;
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
      console.table(res.rows);
      client.end();
    }
  });
}
