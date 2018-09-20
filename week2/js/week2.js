// npm install --save-dev cheerio

const fs = require('fs');
const cheerio = require('cheerio');

let fileNumber = 'm08';

let html = fs.readFileSync('../../week1/data/'+fileNumber+'.html')
let $ = cheerio.load(html);
let scheduleTable = $('table').eq(2).find('tbody');

function cleanText(txt) {
  return txt.replace(/\s\s+/g, ' ').trim();
}

let ds = {
  locations: []
  ,events: []
};

// console.log($('td',scheduleTable.children().html()).length);

scheduleTable.children().each(function(i,child) {
  let childHTML = $(child).html();

  // Location Info
  let locationHTML = $('td',childHTML).eq(0).html();
  let locationName = $('h4',locationHTML).text();
  let meetingName = $('b',locationHTML).text();
  let address = cleanText(locationHTML.split('<br>')[2] + ' ' + locationHTML.split('<br>')[3]);
  let meetingDetails = cleanText($('.detailsBox',locationHTML).text());
  ds.locations.push({
    id: i,
    name: locationName,
    address: address,
    meeting_name: meetingName,
    meeting_details: meetingDetails
  })

  // Event Schedule
  let eventHTML = $('td',childHTML).eq(1).html();
  let eventNumber = -1;
  let eventList = eventHTML.split('<br>');
  eventList = eventList.map(function(e) { return cleanText(e) });
  eventList = eventList.filter(event => event !== '');

  let eventTimes    = []
  let eventTypes    = []
  let eventSpecials = []

  for (let e=0;e<eventList.length;e++) {
    if (eventList[e].substring(0,10) === '<b>Meeting') {
      eventTypes.push({
         event_number : eventNumber
        ,event_id     : (i*10) + eventNumber
        ,event_type   : cleanText(eventList[e].replace('<b>Meeting Type</b>',''))
      });
    } else if (eventList[e].substring(0,10) === '<b>Special') {
      eventSpecials.push({
         event_number : eventNumber
        ,event_id     : (i*10) + eventNumber
        ,special_interest : cleanText(eventList[e].replace('<b>Special Interest</b>',''))
      });
    } else {
      eventNumber++;
      eventTimes.push({
        event_number  : eventNumber
       ,event_id      : (i*10) + eventNumber
       ,eventDay      : eventList[e].split(' ')[0].replace('<b>','')
       ,startTime     : cleanText(eventList[e].split('</b>')[1].split('<b>')[0])
       ,endTime       : cleanText(eventList[e].split('</b>')[eventList[e].split('</b>').length-1])
     });
    }
  };
  let eventData = {
    event_times               : eventTimes
    ,event_types              : eventTypes
    ,event_special_interests  : eventSpecials
  }
  ds.events.push({
    location_id: i
    ,events: eventData
  })
})

let dsJSON = JSON.stringify(ds);

fs.writeFileSync('../data/'+fileNumber+'.json',dsJSON);
