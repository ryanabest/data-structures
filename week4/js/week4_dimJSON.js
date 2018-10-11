const fs = require('fs');
const _ = require('lodash');

let fileNumber = 'm08';
let fileNum = Number(fileNumber.slice(-2))*100;

let geoData = require('../data/'+fileNumber+'_geo.json')
let data = require('../data/'+fileNumber+'.json')
let rawLocations = data.locations;

// Step 1: dimGeoLocation
let dimGeoLocation = []
for (let g=0;g<geoData.length;g++) {
  dimGeoLocation.push({
    geoLocationID    : 0,
    formattedAddress : geoData[g].formatted_address,
    lat              : geoData[g].lat_lon.lat,
    lon              : geoData[g].lat_lon.lng
  })
}

// Remove duplicates in dimGeoLocation and add ID's
dimGeoLocation = _.uniqWith(dimGeoLocation,_.isEqual);
for (let g=0;g<dimGeoLocation.length;g++) { dimGeoLocation[g].geoLocationID = g + fileNum; };

// Step 2: dimLocation and dimMeeting
let dimLocation = [];
let dimMeeting = [];

for (let l=0;l<rawLocations.length;l++) {
  let locationAddressDetailList = rawLocations[l].address.slice(0,-5).split("NY")[0].split(",");
  let mainAddress = locationAddressDetailList.shift();
  dimLocation.push({
    locationID            : 0,
    locationName          : rawLocations[l].name,
    locationAddress       : rawLocations[l].address.split(",")[0],
    locationAddressDetail : locationAddressDetailList.join("").trim()
  });

  dimMeeting.push({
    meetingID      : 0,
    meetingName    : rawLocations[l].meeting_name.split(" - ")[0],
    meetingSubName : rawLocations[l].meeting_name.split(" - ")[1],
    meetingDetails : rawLocations[l].meeting_details
  })
}

// Remove duplicates in dimLocation and add ID's
dimLocation = _.uniqBy(dimLocation,'locationAddress')
for (let l=0;l<dimLocation.length;l++) { dimLocation[l].locationID = l + fileNum; };

// Remove duplicated in dimMeeting and add ID's
dimMeeting = _.uniqWith(dimMeeting,_.isEqual);
for (let m=0;m<dimMeeting.length;m++) { dimMeeting[m].meetingID = m + fileNum; };

fs.writeFileSync('../data/' + fileNumber + '_dimGeoLocation.json',JSON.stringify(dimGeoLocation));
fs.writeFileSync('../data/' + fileNumber + '_dimLocation.json',JSON.stringify(dimLocation));
fs.writeFileSync('../data/' + fileNumber + '_dimMeeting.json',JSON.stringify(dimMeeting));
