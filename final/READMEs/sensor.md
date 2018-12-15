# Final Project 3: How Well Insulated Am I From The Temperature Outside?
This project combines weekly assignments
[8](https://github.com/ryanabest/data-structures/tree/master/week8),
[9](https://github.com/ryanabest/data-structures/tree/master/week9), [10](https://github.com/ryanabest/data-structures/tree/master/final) _(contained within final project folder in 'endpoints' files)_, and [11](https://github.com/ryanabest/data-structures/tree/master/week11) to produce an interactive data visualization that compares the temperature inside my window sill with the temperature outside. I'm collecting the temperature inside using the [real-time temperature sensor](https://github.com/visualizedata/data-structures/blob/master/assignments/final_assignment_03/temperature.md) from [Particle](https://www.particle.io/) that logs the temperature every 30 seconds and the outside temperature using the [Dark Sky API](https://darksky.net/dev), which I'm using to write hourly and daily weather data to PostgreSQL tables at the end of each day.

__[Final Interface](http://data-structures-final-dev.us-east-1.elasticbeanstalk.com/sensor)__

## User Needs and Assumptions
I'm assuming that users of this visualization are most interested to see the difference between the temperature inside and the temperature outside – and they also will not need to filter this data to a specific timeframe. I'm presenting data to the user at the __hour level__, averaging the inside temperatures logged to give an average reading for each hour (more on this process below), so I'm also assuming that users won't need to see data at a more granular level than hour.

## Query Structure

### Writing Data

#### Inside Temperature

I'm measuring the inside temperature in my windowsill using a [Particle Photon Kit](https://store.particle.io/collections/photon) and a temperature sensor placed right inside my windowsill, where I figured any dramatic outside temperature changes or weather events would be most likely to affect the temperature inside:

![Particle set-up][particle]

[particle]: images/particle.jpg "Particle set-up"

I connect to the Particle API and log the value from the temperature sensor every 30 seconds, writing a new row into a PostgreSQL table that includes the time logged (__last handshake at__ variable) and temperature (__analogvalue__ variable, in degrees &#8451;), along with other extraneous data that is part of the standard API response from Particle, for example:

name | result | last_heard | last_handshake_at | device_id | product_id | date_added
--- | --- | --- | --- | --- | --- | ---
analogvalue |	16.564102564102555 | 2018-12-15 16:13:06 | 2018-12-15 15:55:07 |	25003f000947373034353237 | 6 |2018-12-15 16:13:06
analogvalue |	0.7692307692307665 |	2018-12-15 16:12:36 | 2018-12-15 15:55:07 | 25003f000947373034353237 | 6	| 2018-12-15 16:12:36
analogvalue |	20.43223443223443 |	2018-12-15 16:12:06 | 2018-12-15 15:55:07 | 25003f000947373034353237 | 6	| 2018-12-15 16:12:06
analogvalue |	20.512820512820518 |	2018-12-15 16:11:36 | 2018-12-15 15:55:07 | 25003f000947373034353237 | 6	| 2018-12-15 16:11:36
analogvalue |	33.245421245421234 |	2018-12-15 16:11:06 | 2018-12-15 15:55:07 | 25003f000947373034353237 | 6 | 2018-12-15 16:11:06

This process that runs the [script](https://github.com/ryanabest/data-structures/blob/master/week9/particle.js) to collect and log this response from Particle on a 30-second cadence is implemented using [PM2](http://pm2.keymetrics.io/) and [AWS EC2](https://aws.amazon.com/ec2/).

#### Outside Temperature

I've also set up a [Heroku](https://github.com/ryanabest/ds-particle-heroku) app that uses the [Heroku Scheduler](https://elements.heroku.com/addons/scheduler) tool to execute a [script](https://github.com/ryanabest/ds-particle-heroku/blob/master/darksky.js) that connects to Darksky's API using the lat/lon coordinates of my specific home address in Brooklyn. This API provides both hourly weather (including the air temperature in &#8451; that hour) and daily weather summaries (including high and low temperatures in &#8451; for that day). I am currently writing almost all weather statistics returned from this API to a PostgreSQL table, which includes weather summary (clear / partly cloudy / etc), precipitation (probability and type), cloud cover / UV index, apparent temperature, and more (the [Darksky API docs](https://darksky.net/dev/docs#time-machine-request) have extensive lists of the data fields returned from this "time machine" API). I run this script every night at 12:30 AM, which pulls both daily and hourly weather data from the previous day (e.g. if this script runs on Dec 15th, 12:30 AM, it will pull data from Dec 14th, 2018).

### Reading Data

Since I don't pull outside temperature until the end of each day, when the front-end visualization loads my [query](https://github.com/ryanabest/data-structures/blob/master/final/routes/sensor.js) loads pulls data __up through the day before__ the current date into the front-end visualization. This query finds all hours for which we have outside temperature, then pulls in average inside temperatures from the Particle table for those times. There were a few periods where my sensor either went offline or I had not yet adequately set up my processes to consistently and continually log sensor values on my EC2 server. I also fill in these gaps of missing data by finding the hours on either side of that gap with at least 20 readings and having the inside temperature progress from the first "real" temperature reading to the second in a linear fashion. For example, if the temperature sensor was out from 4PM to 6PM and the average temperature for 3PM was 50&#8457; and for 6PM was 56&#8457;, then I will fill in 4PM with 52&#8457; and 5PM with 54&#8457;. Finally, my query will return __one row per hour__ and will include the following statistics:

+ __date_stamp__: date and hour
+ __inside_temp__: average or estimated inside temperature in &#8451;
+ __outside_temp__: outside temperature in &#8451;
+ __temp_diff__: difference between inside temperature and outside temperature in &#8451;
+ __multiplier__: how many linear progressions need to be applied if the inside temperature is estimated _(included for data quality checking and printing to the console during development)_
+ __avg_increase__: what is the linear progression needed to bridge the gap between "real" inside temperature readings _(included for data quality checking and printing to the console during development)_
+ __estimated__: boolean signifying if the inside temperature was esimated (1 = esitmated, 0 = "real" reading)

![Sample sensor query JSON response][particleJSON]

[particleJSON]: images/particleJSON.png "Sample sensor query JSON response"

## Visual Representation of Data

My visualization implements a [difference](https://flowingdata.com/charttype/difference-chart/) chart, which fills in the space between lines to highlight a greater-than and less-than differences over time...

![Sensor1][Sensor1]

[Sensor1]: images/Sensor1.png "Sensor1"

...with a hover-over interaction that allows users to see the specific inside temperature, outside temperature, and difference between the two at any point in the timeframe visualized.

![Sensor2][Sensor2]

[Sensor2]: images/Sensor2.png "Sensor2"

The data that is pulled from the query above therefore needs to be bound to a few different visual elements in my visualization, all of which were implemented using d3:

+ Inside temperature across all hours is bound to the top line
+ Outside temperature across all hours is bound to the bottom line
+ Temperature differences for each hour are bound to individual bars – I create one bar for each hour with an x/y coordinate based on the inside temperature and a height based on the difference between the inside/outside temperature
+ I also created a rectangle that spans the entire svg but has no background to implement the hover capabilities:
  + When the user moves their mouse in this invisible rectangle, I convert the x-position of their mouse to the specific hour they're hovering over
  + I then bind the inside temperature to a dotted circle and the outside temperature to another dotted circle to highlight the specific point on each line the user is hovering over
  + Finally, the date, hour, inside temperature, outside temperature, temperature difference (all in both &#8451; and &#8457;), and "estimated" status of the inside temperature are all used to create text elements in a "tooltip" div
    + The position of this tooltip div is based on the position of the mouse itself

## Next Steps
+ Add some text to provide a narrative before the visualization itself to tee up what the user will be looking at
+ Pick out points that are particularly interesting and provide context behind them (maybe a good use for scrollytelling)
+ Implement some kind of lower bound for the dates included, since this would continue to expand and expand. Maybe that last month of data? Have it user controlled? For now I'll just need to see how the visualization looks after I cut the sensor off (unless I want to keep it running after this course ends)
