const fs = require('fs');
const _ = require('lodash');

init();

function init() {
  let fileNumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10']
  // let fileNumber = 'm08';
  for (let f=0;f<fileNumbers.length;f++) {
    dimJSON(fileNumbers[f]);
  }
}

function dimJSON(fileNumber) {
  let fileNum = Number(fileNumber.slice(-2))*100;

  let dir = '../data/'+fileNumber;
  let geoData = require(dir+'/'+fileNumber+'_geo.json')
  let data = require(dir+'/'+fileNumber+'.json')
  let rawLocations = data.locations;

  // Step 1: dimGeoLocation
  let dimGeoLocation = loadDimGeoLocation(geoData);
  // Step 2: dimLocation and dimMeeting
  let dimLocation = loadDimLocation(rawLocations);
  let dimMeeting = loadDimMeeting(rawLocations);

  writeFile(dimGeoLocation,'dimGeoLocation');
  writeFile(dimLocation,'dimLocation');
  writeFile(dimMeeting,'dimMeeting');

  function writeFile(fileObj,fileName) {
    let dir = '../data/'+fileNumber;
    fs.writeFileSync(dir+'/'+fileNumber+ '_'+fileName+'.json',JSON.stringify(fileObj));
  }

  // fs.writeFileSync('../data/' + fileNumber + '_dimGeoLocation.json',JSON.stringify(dimGeoLocation));
  // fs.writeFileSync('../data/' + fileNumber + '_dimLocation.json',JSON.stringify(dimLocation));
  // fs.writeFileSync('../data/' + fileNumber + '_dimMeeting.json',JSON.stringify(dimMeeting));

  function loadDimGeoLocation(geoData) {
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
    return dimGeoLocation;
  }

  function loadDimLocation(rawLocations) {
    let dimLocation = [];
    for (let l=0;l<rawLocations.length;l++) {
      let locationAddressDetailList = rawLocations[l].address.slice(0,-5).split("NY")[0].split(",");
      let mainAddress = locationAddressDetailList.shift();
      dimLocation.push({
        locationID            : 0,
        locationName          : rawLocations[l].name,
        locationAddress       : rawLocations[l].address.split(",")[0],
        locationAddressDetail : locationAddressDetailList.join("").trim()
      });
    }
    // Remove duplicates in dimLocation and add ID's
    dimLocation = _.uniqBy(dimLocation,'locationAddress')
    for (let l=0;l<dimLocation.length;l++) { dimLocation[l].locationID = l + fileNum; };
    return dimLocation;
  }

  function loadDimMeeting(rawLocations) {
    let dimMeeting = [];
    for (let l=0;l<rawLocations.length;l++) {
      dimMeeting.push({
        meetingID      : 0,
        meetingName    : rawLocations[l].meeting_name.split(" - ")[0],
        meetingSubName : rawLocations[l].meeting_name.split(" - ")[1],
        meetingDetails : rawLocations[l].meeting_details
      })
    }
    // Remove duplicated in dimMeeting and add ID's
    dimMeeting = _.uniqWith(dimMeeting,_.isEqual);
    for (let m=0;m<dimMeeting.length;m++) { dimMeeting[m].meetingID = m + fileNum; };
    return dimMeeting;
  }
}
