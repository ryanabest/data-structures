const async = require('async');

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

  loadParams(vizEntries[6]);

  function loadParams(i) {
    let params = {};
    params.Item = i;
    params.TableName = "deardiary_viz";

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
    constructor(name, date, type, info) {
      this.name = {};
      this.name.S = name;
      this.date = {};
      this.date.S = new Date(date).toLocaleString();
      this.type = {};
      this.type.S = type;
      this.info = {};
      this.info.M = info;
    }
  }

  vizEntries.push( new vizEntry (
    "Extensive Data Shows Punishing Reach of Racism for Black Boys",
    new Date(),
    "interactive viz",
    {
      publication: {S: "New York Times (The Upshot)"},
      link: {S: "https://www.nytimes.com/interactive/2018/03/19/upshot/race-class-white-and-black-men.html"},
      thoughts: {SS: [
         "Use of animation serves as a useful explanation of concepts and a tool for facilitating storytelling - it's not used as a gimmick or a prop"
        ,"Various visualizations that tell a cohesive story and effectively maintain design elements and visual language throughout the story"
        ,"I would have liked to see an option to either speed up the animated viz or see what the sankey chart would look like in static form as well"
      ]},
      tags: {SS:["animation","storytelling","politics","sankey"]},
      pubDate: {S: new Date("March 19, 2018").toDateString()},
      social: {S: "https://twitter.com/UpshotNYT/status/975774912764882946"},
      picture: {S: "../examples/O_tw_rUu.jpeg"}
    }
  ))

  vizEntries.push( new vizEntry (
    "The Rhythm Of Food",
    new Date(),
    "interactive viz",
    {
      author: {S: "Moritz Stefaner"},
      thoughts: {SS: [
        "Great narrative structure - he uses a novel visualization technique that could be hard to understand, so he does a really great job of walking his users through what the viz is showing in an engaging and intuitive way."
        ,"Also does a great job of highlighting the interesting graphics at once and in calling out interesting points within a graphic to add context."
        ,"'It's October, what is being asked for now?' is a nice touch that grounds the project in the current experience of its user."
      ]},
      tags: {SS:["visualization","storytelling","explorative"]},
      link: {S: "http://rhythm-of-food.net/"},
      documentation: {S: "https://truth-and-beauty.net/projects/the-rhythm-of-food"},
      awards: {S: "Information is Beautiful Awards 2017 - Gold"},
      picture: {SS: [
        "../examples/01-apricot-highlight.png"
        ,"../examples/02-elderberry.png"
        ,"../examples/02-charts-02.png"
      ]},
      video: {S: "https://vimeo.com/193889103"}
    }
  ))

  vizEntries.push( new vizEntry (
    "Visual Cinnamon - Nadieh Bremer",
    new Date(),
    "portfolio",
    {
      author: {S: "Nadieh Bremer"},
      thoughts: {SS: [
        "Showcases projects with great introductory project descriptions and overview"
        ,"High-profile images show the beauty of her work"
        ,"I wish there was more detail on her thought process and why she made the decisions she did in each project"
      ]},
      tags: {SS:["portfolio","visualization","expert"]},
      awards: {S: "Information is Beautiful Awards 2017 - Best Individual"},
      picture: {S: "../examples/VisualCinnamon.png"},
      link: {S: "https://www.visualcinnamon.com/portfolio/"}
    }
  ))

  vizEntries.push( new vizEntry (
    "NYC Taxis: A Day in the Life",
    new Date(),
    "interactive viz",
    {
      link: {S: "https://chriswhong.github.io/nyctaxi/"},
      author: {S: "Chris Wong"},
      author_page: {S: "https://chriswhong.com/"},
      thoughts: {SS: [
        "Engaging and effective animation shows us the movement and business one a random taxi"
        ,"Really looks and feels alive - feels as if we're riding in each taxi"
      ]},
      tags: {SS:["animation","mapping","LeafLet"]},
      awards: {S: "Information is Beautiful Awards 2014 - Best Motion Infographic - Gold"},
      picture: {S: "https://iibawards-prod.s3.amazonaws.com/projects/images/000/000/594/large.jpg?1467151682"}
    }
  ))

  vizEntries.push( new vizEntry (
    "Here's How America Uses Its Land",
    new Date(),
    "interactive viz",
    {
      link: {S: "https://www.bloomberg.com/graphics/2018-us-land-use/"},
      pubDate: {S: new Date("July 31, 2018").toDateString()},
      publication: {S: "Bloomberg"},
      author: {S: "Dave Merrill and Lauren Leatherby"},
      thoughts: {SS: [
        "Scrollytelling works here since the background graphic stays consistent and scrolling progressed through different applications of that same base visual"
        ,"Violates a couple tenants of core data visualization that prevent some easy comparisons across categories - especially foregoing shared axes"
        ,"Some wonkiness with positioning of background graphic and syncing up when the map changes based on the text in front"
      ]},
      tags: {SS:["scrollytelling","mapping"]}
    }
  ))

  vizEntries.push( new vizEntry (
    "Record Numbers of Women Running for Office May Not Mean Big Gains in Congress",
    new Date(),
    "interactive viz",
    {
      link: {S: "https://www.bloomberg.com/graphics/2018-women-candidates/"},
      pubDate: {S: new Date("May 7, 2018").toDateString()},
      publication: {S: "Bloomberg"},
      thoughts: {SS: [
        "Better use of scrollytelling at the end of the story - graphic stays consistent, yellow highlighting matches with the text in front, and the scroll really aids the storytelling"
        ,"Exhaustive story supported with multiple viz"
        ,"Use of dots with arrows is a really effective way to show a lot of data in one place"
        ,"Small multiple maps is also quite nice"
      ]},
      tags: {SS:["visualization","scrollytelling","small multiples","mapping","politics"]}
    }
  ))

  vizEntries.push( new vizEntry (
    "Generative WorldCup",
    new Date(),
    "static viz",
    {
      link: {S: "http://zehfernandes.com/generativeworldcup2018/"},
      author: {S: "Zeh Fernandes"},
      tags: {SS: ["generative art","sports","art","poster","graphic design","abstract"]},
      thoughts: { SS: [
        "Beautiful posters with vibrant colors"
        ,"Methodology and meaning are a bit hard to follow and aren't sufficiently documented from a data viz standpoint"
        ,"Aesthetics are more important here, considering these pieces are generative art posters, rather than considering tenants of pure data visualization"
        ,"I would have added a 'how to read this' section that details what each section portrays and allows the audience to learn more about the game itself outside of appreciating the beauty of each poster"
      ]},
      image: {SS: ["https://pbs.twimg.com/media/DgakD9JX0AErvtN.jpg","https://pbs.twimg.com/media/DgaqvdfW4AA9f8H.jpg"]}
    }
  ))

  return vizEntries;
}
