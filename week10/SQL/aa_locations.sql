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
