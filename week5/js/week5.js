
init();

function init() {
  let vizEntries = loadVizEntry();
  loadEntries(vizEntries);
}

function loadEntries(vizEntries) {
  const AWS = require('aws-sdk');
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.AWS_ID;
  AWS.config.secretAccessKey = process.env.AWS_KEY;
  AWS.config.region = "us-east-1";
  const dynamodb = new AWS.DynamoDB();

  // loadParams(0);

  for (let i=0;i<vizEntries.length;i++) {
    loadParams(i);
  }

  function loadParams(i) {
    let params = {};
    params.Item = vizEntries[i];
    params.TableName = "deardiary_viz"

    // console.log(params.Item.info);

    dynamodb.putItem(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  }
}

function loadVizEntry() {

  let vizEntries = [];
  class vizEntry {
    // Data Types: https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html
    constructor(entry_id, ·name, date, type, info) {
      this.entry_id = {};
      this.entry_id.S = entry_id;
      this.name = {};
      this.name.S = name;
      this.date = {};
      this.date.S = new Date(date).toDateString();
      this.type = {};
      this.type.S = type;
      this.info = {};
      this.info.M = info;
    }
  }

  let nytRaceClass = {
    entry_id: "test_viz1",
    name: "Extensive Data Shows Punishing Reach of Racism for Black Boys",
    date: new Date(),
    type: "viz",
    info: {
      publication: {S: "New York Times (The Upshot)"},
      link: {S: "https://www.nytimes.com/interactive/2018/03/19/upshot/race-class-white-and-black-men.html"},
      thoughts: {SS: [
         "Use of animation serves as a useful explanation of concepts and a tool for facilitating storytelling - it's not used as a gimmick or a prop."
        ,"Various visualizations that tell a cohesive story and effectively maintain design elements throughout."
        ,"Such important information that puts data and compelling visuals behind topics our society needs to grapple with."
        ,"Gorgeous!"
      ]},
      pubDate: {S: new Date("March 19, 2018").toDateString()},
      social: {S: "https://twitter.com/UpshotNYT/status/975774912764882946"},
      picture: {S: "../examples/O_tw_rUu.jpeg"}
    }
  }

  let rhythmOfFood = {
    entry_id: "test_viz2",
    name: "The Rhythm Of Food",
    date: new Date(),
    type: "viz",
    info: {
      author: {S: "Moritz Stefaner"},
      thoughts: {SS: [
        "Great narrative structure - he uses a novel visualization technique that could be hard to understand, so he does a really great job of walking his users through what the viz is showing in an engaging and intuitive way."
        ,"Also does a great job of highlighting the interesting graphics at once and in calling out interesting points within a graphic to add context."
        ,"'It's October, what is being asked for now?' is a nice touch that grounds the project in the current experience of its user."
      ]},
      link: {S: "https://www.nytimes.com/interactive/2018/03/19/upshot/race-class-white-and-black-men.html"},
      documentation: {S: "https://truth-and-beauty.net/projects/the-rhythm-of-food"},
      awards: {S: "Information is Beautiful Awards 2017 - Gold"},
      picture: {SS: [
        "../examples/01-apricot-highlight.png"
        ,"../examples/02-elderberry.png"
        ,"../examples/02-charts-02.png"
      ]},
      video: {S: "https://vimeo.com/193889103"}
    }
  }

  let migrationOfArt = {
    entry_id: "test_viz3",
    name: "The Migration Of Art",
    date: new Date(),
    type: "viz",
    info: {
      author: {S: "Ryan Best"},
      thoughts: {S: "Ha! This is my project from Major Studio 1 last year with The Met."},
      link: {S: "https://ryanabest.com/ms1-2018/interactivity/"},
      documentation: {S: "https://ryanabest.com/work/MigrationOfArt/"},
      picture: {S: "https://ryanabest.com/work/MigrationOfArt/assets/TravelTimeline.png"},
      video: {S: "https://vimeo.com/269368498"},
      social: {S: "https://twitter.com/buenosbestos/status/1019977737644232712"}
    }
  }

  vizEntries.push(new vizEntry(nytRaceClass.entry_id,   nytRaceClass.name,   nytRaceClass.date,   nytRaceClass.type,   nytRaceClass.info));
  vizEntries.push(new vizEntry(rhythmOfFood.entry_id,   rhythmOfFood.name,   rhythmOfFood.date,   rhythmOfFood.type,   rhythmOfFood.info));
  vizEntries.push(new vizEntry(migrationOfArt.entry_id, migrationOfArt.name, migrationOfArt.date, migrationOfArt.type, migrationOfArt.info));

  return vizEntries;
}
