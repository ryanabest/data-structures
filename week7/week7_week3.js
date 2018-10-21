const request = require('request');
const fs = require('fs');
const async = require('async');

// https://developers.google.com/maps/documentation/geocoding/start
const googleGeoBaseURL = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const googleGeoKey = process.env.GOOGLE_GEO_KEY;


let fileNumber = 'm06';
let fileNumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10']

init()

function init() {
  pullGeoLocations(fileNumber);
}

function pullGeoLocations(fileNumber) {
  let file = require('../data/'+fileNumber+'/'+fileNumber+'.json');
  let addresses = file.locations;
  let locations_geo = [];

  async.each(addresses, function(value,callback) {
    let id = value.id;
    let address = value.address;
    let address_search = address.split(",")[0].split("-")[0] + ", New York, NY " + address.slice(-5);
    let addressAPI = address_search.split(' ').join('+');
    let apiURL = googleGeoBaseURL + addressAPI + '&key=' + googleGeoKey;
    apiURL = apiURL.replace('80+5th+Avenue','80+Fifth+Avenue');
    console.log(apiURL);
    // from the request out of the Google Maps API, I want to get cleaned up Addresses and Lat/Lon
    // since I'm not cleaning up the addresses manually, I assume these will be partial matches and I can spot check the lat/lon accuracy by comparing the address and cleaned address

    // request(apiURL, function(err,resp,body) {
    //   if (err) {throw err;}
    //   else {
    //     let results = JSON.parse(body);
    //     // if (!results.results[0]) {
    //     //   console.log(apiURL);
    //     //   console.log(id);
    //     // }
    //     let lat_lon = results.results[0].geometry.location;
    //     let formatted_address = results.results[0].formatted_address;
    //     locations_geo.push({
    //       id                : id,
    //       lat_lon           : lat_lon,
    //       formatted_address : formatted_address
    //       })
    //     }
    //   });
    //   setTimeout(callback, 2000);
  }, function() {
    let geoJSON = JSON.stringify(locations_geo);
    let dir = '../data/'+fileNumber;
    fs.writeFileSync(dir+'/'+fileNumber+'_geo.json',geoJSON);
    console.log('*** *** *** *** ***');
    console.log('Number of locations in this zone: ');
    console.log(locations_geo.length);
  })
}
