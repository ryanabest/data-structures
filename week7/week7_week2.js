// npm install --save-dev cheerio

const fs = require('fs');
const cheerio = require('cheerio');

let fileNumbers = ['m01','m02','m03','m04','m05','m06','m07','m08','m09','m10']
let fileNumber = 'm08';

init()

function init() {
  for (let f=0;f<fileNumbers.length;f++) { writeFile(fileNumbers[f]); }
}

function cleanText(txt) {
  return txt.replace(/\s\s+/g, ' ').trim();
}

function writeFile(fileNumber) {
  let ds = {
    locations: []
    ,events: []
  };

  let html = fs.readFileSync('../data/raw/'+fileNumber+'.html')
  let $ = cheerio.load(html);
  let scheduleTable = $('table').eq(2).find('tbody');

  scheduleTable.children().each(function(i,child) {
    let childHTML = $(child).html();

    // Location Info
    let locationHTML = $('td',childHTML).eq(0).html();
    let locationName = $('h4',locationHTML).text();
    let meetingName = $('b',locationHTML).text();
    let address = cleanText(locationHTML.split('<br>')[2] + ' ' + locationHTML.split('<br>')[3]);
    let meetingDetails = '';
    if ($("span[style='color:darkblue; font-size:10pt;']",locationHTML).html()) {
      meetingDetails += 'Wheelchair access | '
    }
    let meetingOne = $('.detailsBox',locationHTML).html();
    if (meetingOne) {
      for (let m=0;m<meetingOne.split("<br>").length;m++) {
        meetingDetails += cleanText(meetingOne.split("<br>")[m]).replace("|","");
        meetingDetails += " | ";
      }
      // console.log(meetingOne.split("<br>"));
    }
    // meetingDetails += cleanText($('.detailsBox',locationHTML).text());

    // console.log(meetingDetails);
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
          ,event_id     : (i*100) + eventNumber
          ,event_type   : cleanText(eventList[e].replace('<b>Meeting Type</b>',''))
        });
      } else if (eventList[e].substring(0,10) === '<b>Special') {
        eventSpecials.push({
           event_number : eventNumber
          ,event_id     : (i*100) + eventNumber
          ,special_interest : cleanText(eventList[e].replace('<b>Special Interest</b>',''))
        });
      } else {
        eventNumber++;
        eventTimes.push({
          event_number  : eventNumber
         ,event_id      : (i*100) + eventNumber
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

  let dir = '../data/'+fileNumber;
  // let dir = '../data'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  fs.writeFileSync(dir+'/'+fileNumber+'.json',dsJSON);

}

// console.log($('td',scheduleTable.children().html()).length);
