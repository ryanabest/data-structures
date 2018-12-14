const express = require('express'),
      router = express.Router(),
      moment = require('moment'),
      { Client } = require('pg');

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

router.get('/', function(req, res, next) {
  let client = createClient();
  client.connect();
  let query = sensorQuery();
  client.query(query, (err,qres) => {
    if (err) { throw (err) } // what do I want to do with error handling here?
    else {
      let sensor = '';
      let sensorData = qres.rows;
      client.end();
      for (let s=0;s<sensorData.length;s++) {
        if (sensorData[s].outside_temp !== null) {
          let thisSensorDataPoint = {
            date_stamp: moment.utc(sensorData[s].date_stamp).local().format('YYYY-MM-DD HH:mm:ss'),
            inside_temp: sensorData[s].inside_temp,
            outside_temp: sensorData[s].outside_temp,
            temp_diff: sensorData[s].temp_diff,
            estimated: sensorData[s].estimated,
            year: moment.utc(sensorData[s].date_stamp).local().format('YYYY'),
            month: moment.utc(sensorData[s].date_stamp).local().format('MM'),
            day: moment.utc(sensorData[s].date_stamp).local().format('DD'),
            hour: moment.utc(sensorData[s].date_stamp).local().format('HH')
          }
          sensor += 'sensorData.push('+JSON.stringify(thisSensorDataPoint)+');'
        }
      }
      res.render('sensor', {title: 'Sensor Interface', sensor: sensor});
    }
  });
});

function sensorQuery() {
  return `
  WITH DATES as (
    SELECT
     date_trunc('day',d.datetime) as day
     ,date_part('hour',d.datetime)::int as hour
     ,date_trunc('hour',d.datetime) as date_stamp, *
    FROM darksky_hour d)

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
       date_stamp
      ,inside_temp
      ,outside_temp
      ,inside_temp - outside_temp as temp_diff
      ,multiplier
      ,avg_increase
      ,estimated
    FROM HOURLY;
  `
}

module.exports = router;
