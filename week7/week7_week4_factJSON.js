const fs = require('fs');
const _ = require('lodash');
const async = require('async');

init();

function init() {
  // let fileNumber = 'm08';
  let fileNumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10']
  // let fileNumber = 'm08';
  for (let f=0;f<fileNumbers.length;f++) {
    factJSON(fileNumbers[f]);
  }
}

function factJSON(fileNumber) {
  let dir = '../data/'+fileNumber;
  let dimGeoLocation = require(dir+'/'+fileNumber+'_dimGeoLocation.json');
  let dimLocation = require(dir+'/'+fileNumber+'_dimLocation.json');
  let dimMeeting = require(dir+'/'+fileNumber+'_dimMeeting.json');
  let geoData = require(dir+'/'+fileNumber+'_geo.json')
  let data = require(dir+'/'+fileNumber+'.json')
  let rawMeetings = data.events;
  let rawLocations = data.locations;

  class factDataPoint {
    constructor() {
      this.geoLocationID          = 99999;
      this.locationID             = 99999;
      this.meetingID              = 99999;
      this.meetingDay             = '';
      this.meetingStartTime       = '';
      this.meetingEndTime         = '';
      this.meetingType            = '';
      this.meetingSpecialInterest = '';
    }
  }

  let factMeetingSchedule = [];

  async.forEach(rawMeetings, function(meeting_value,callback) {
    let thisFactDataPoint = new factDataPoint();

    let location_id = meeting_value.location_id;

    // geoLocationID
    for (let g=0;g<geoData.length;g++) {
      if (geoData[g].id === location_id) {
        for (let dg=0;dg<dimGeoLocation.length;dg++) {
          if (dimGeoLocation[dg].formattedAddress === geoData[g].formatted_address)
          { thisFactDataPoint.geoLocationID = dimGeoLocation[dg].geoLocationID };
        }
      }
    }

    // locationID and meetingID
    for (let l=0;l<rawLocations.length;l++) {
      if (rawLocations[l].id === location_id) {
        for (let dl=0;dl<dimLocation.length;dl++) {
          if (dimLocation[dl].locationAddress == rawLocations[l].address.split(",")[0]) // I used the first part of the address as the "unique" meeting_value for each location
              { thisFactDataPoint.locationID = dimLocation[dl].locationID };
        }
        for (let dm=0;dm<dimMeeting.length;dm++) {
          if (dimMeeting[dm].meetingName === rawLocations[l].meeting_name.split(" - ")[0]
              && dimMeeting[dm].meetingSubName === rawLocations[l].meeting_name.split(" - ")[1]
              && dimMeeting[dm].meetingDetails === rawLocations[l].meeting_details
              )
            { thisFactDataPoint.meetingID = dimMeeting[dm].meetingID };
        }
      }
    }

    let event_times = meeting_value.events.event_times;
    let event_types = meeting_value.events.event_types;
    let event_special = meeting_value.events.event_special_interests;

    for (let t=0;t<event_times.length;t++) {
      let event_id = event_times[t].event_id;
      thisFactDataPoint.meetingDay = event_times[t].eventDay;
      thisFactDataPoint.meetingStartTime = event_times[t].startTime;
      thisFactDataPoint.meetingEndTime = event_times[t].endTime;

      for (let y=0;y<event_types.length;y++) {
        if (event_types[y].event_id === event_id) {
          thisFactDataPoint.meetingType = event_types[y].event_type;
        }
      }

      for (let s=0;s<event_special.length;s++) {
        if (event_special[s].event_id === event_id) {
          thisFactDataPoint.meetingSpecialInterest = event_special[s].special_interest;
        }
      }
    }
    factMeetingSchedule.push(thisFactDataPoint);
    callback();
  }, function() {
    fs.writeFileSync(dir + '/' + fileNumber + '_factMeetingSchedule.json',JSON.stringify(factMeetingSchedule));
  })

}
