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
