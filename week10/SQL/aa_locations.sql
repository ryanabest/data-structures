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
   ,(RIGHT('0' || date_part('hour',f.meetingstarttime::time)::int,2) || ':' || RIGHT('0' || date_part('minute',f.meetingstarttime::time),2) || ':00')::time as meetingstarttime
   -- ,date_part('hour',f.meetingstarttime::time)::int as meetingStartHour
   -- ,date_part('minute',f.meetingstarttime::time)::int as meetingStartMin
   ,(RIGHT('0' || date_part('hour',f.meetingendtime::time)::int,2) || ':' || RIGHT('0' || date_part('minute',f.meetingendtime::time),2) || ':00')::time as meetingendtime
   -- ,date_part('hour',f.meetingendtime::time)::int as meetingEndHour
   -- ,date_part('minute',f.meetingendtime::time)::int as meetingEndMin
   ,split_part(f.meetingtype,' = ',2) as meetingtype
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

, TODAYS_MEETINGS as (
SELECT *, lldistance(m.lat,m.lon,40.7353003,-73.9967813) as lldistance
FROM MEETINGS m
JOIN TODAY t
  ON UPPER(m.meetingday) LIKE '%'||t.day||'%'
  AND t.earliest_time <= m.meetingstarttime
  AND t.latest_time >= m.meetingstarttime
WHERE lldistance(m.lat,m.lon,40.7353003,-73.9967813) <= 2
)

, TODAYS_MEETING_LOCATIONS as (
SELECT DISTINCT
   geolocationid
  ,locationid
  ,locationname
  ,formattedaddress
  ,locationaddressdetail
  ,lat
  ,lon
  ,lldistance
  ,meetingid
 FROM TODAYS_MEETINGS
 )

SELECT
  geolocationid
 ,formattedaddress
 ,lat
 ,lon
 ,lldistance
 ,array_agg(DISTINCT locationid) as locationid_list
 ,array_agg(DISTINCT meetingid) as meetingid_list
FROM TODAYS_MEETING_LOCATIONS
GROUP BY geolocationid,formattedaddress,lat,lon,lldistance
ORDER BY lldistance ASC;
