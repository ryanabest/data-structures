const { Client } = require('pg');
const async = require('async');

const client = new Client({
  user: 'ryanabest',
  host: 'datastructures.cbijimkrmieh.us-east-1.rds.amazonaws.com',
  database: 'datastructures',
  password: process.env.AWS_PW,
  port: 5432,
})

init();

function init() {
  client.connect();
  let query = hourTableQuery();
  runQuery(client,query);
  // helloWorld();
}

function hourTableQuery() {
  let query = `
  CREATE TABLE darksky_hour
  (
     date_added timestamp with time zone
    ,time int
    ,datetime timestamp with time zone
    ,summary varchar(5000)
    ,precipIntensity real
    ,precipProbability real
    ,precipType varchar(50)
    ,temperature real
    ,apparentTemperature real
    ,cloudCover real
    ,uvIndex int
  )
  `
  return query;
}

function tableQuery() {
  let query = `
    CREATE TABLE darksky_forecast
    (
       date_added timestamp with time zone
      ,forecast_date timestamp with time zone
      ,forecast_time int
      ,summary varchar(5000)
      ,sunriseTime int
      ,sunriseDateTime timestamp with time zone
      ,sunsetTime int
      ,sunsetDateTime timestamp with time zone
      ,precipIntensity real
      ,precipIntensityMax real
      ,precipIntensityMaxTime int
      ,precipIntensityMaxDateTime timestamp with time zone
      ,precipProbability real
      ,precipType varchar(50)
      ,temperatureHigh real
      ,temperatureHighTime int
      ,temperatureHighDateTime timestamp with time zone
      ,temperatureLow real
      ,temperatureLowTime int
      ,temperatureLowDateTime timestamp with time zone
      ,apparentTemperatureHigh real
      ,apparentTemperatureHighTime int
      ,apparentTemperatureHighDateTime timestamp with time zone
      ,apparentTemperatureLow real
      ,apparentTemperatureLowTime int
      ,apparentTemperatureLowDateTime timestamp with time zone
      ,cloudCover real
      ,uvIndex int
      ,uvIndexTime int
      ,uvIndexDateTime timestamp with time zone
      ,temperatureMin real
      ,temperatureMinTime int
      ,temperatureMinDateTime timestamp with time zone
      ,temperatureMax real
      ,temperatureMaxTime int
      ,temperatureMaxDateTime timestamp with time zone
      ,apparentTemperatureMin real
      ,apparentTemperatureMinTime int
      ,apparentTemperatureMinDateTime timestamp with time zone
      ,apparentTemperatureMax real
      ,apparentTemperatureMaxTime int
      ,apparentTemperatureMaxDateTime timestamp with time zone
    );
  `
  return query;
}

function dropQuery() {
  let query = 'DROP TABLE darksky_forecast;';
  return query;
}

function deleteQuery() {
  let query = 'DELETE FROM darksky_forecast;';
  return query;
}

function runQuery(client,query) {
  client.query(query, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      console.log(res);
      client.end();
    }
  });
}

// Hello World
function helloWorld() {
  console.log(process.env.AWS_PW);
  client.query("SELECT precipIntensity from darksky_forecast", (err,res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res)
    }
    client.end();
  });
}
