const async = require('async');

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

init();

function init() {
  let vizEntries = loadNYTFacesOfDiversity();
  // let vizEntries = loadHumanTerrian();
  // let vizEntries = bloombergMidtermCartogram();
  // let vizEntries = recordNumberOfWomen();
  // let vizEntries = dayInTheLife();
  // let vizEntries = loadFirstVizEntries();
  // let vizEntries = loadStaticAndPortfolioEntries();
  // let vizEntries = loadTruthAndBeauty();
  // let vizEntries = loadInteractivesOne();
  // let vizEntries = loadInteractivesTwo();
  // let vizEntries = loadYearInWeather();
  // console.log(vizEntries);
  loadEntries(vizEntries);
}

function loadEntries(vizEntries) {
  const AWS = require('aws-sdk');
  AWS.config = new AWS.Config();
  AWS.config.accessKeyId = process.env.AWS_ID;
  AWS.config.secretAccessKey = process.env.AWS_KEY;
  AWS.config.region = "us-east-1";
  const dynamodb = new AWS.DynamoDB();

  for (let e=0;e<vizEntries.length;e++) {
    loadParams(vizEntries[e]);
  }

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

function loadInteractivesTwo() {
  let vizEntries = [];

  vizEntries.push( new vizEntry(
    "The Differences in How CNN, MSNBC, & Fox Cover the News",
    new Date("12/1/2018 16:00"),
    "interactive viz",
    {
      publication: {S: "The Pudding"},
      author: {S: "Charlie Smart"},
      picture: {S: "https://github.com/ryanabest/data-structures/blob/master/week5/examples/PuddingNews.png?raw=true"},
      tags: { SS: ["news","politics","scrollytelling","narrative","explorative"]},
      thoughts: {L: [
        {S: "This piece does a great job of combining narrative data viz storytelling with opportunities for exploration. It's not easy to combine explorative and narrative in one piece, but this piece takes advantage of effective scrollytelling to show examples of how a user might explore each viz. I also particularly like the triangle scatterplot – it does a great job at visually demonstrating the relative tendencies of each news outlet."}
      ]},
      link: {S: "https://pudding.cool/2018/01/chyrons/"}
    }
  ));

  vizEntries.push( new vizEntry(
    "Inside Kyrie Irving's Bag of Tricks",
    new Date("12/1/2018 16:30"),
    "interactive viz",
    {
      publication: {S: "ESPN"},
      author: {S: "Chris Forsberg"},
      picture: {S: "http://a.espncdn.com/prod/styles/pagetype/otl/20181009_kyrieHandles/images/kyrie_desktop.gif"},
      tags: {SS: ["sports","animation","basketball"]},
      thoughts: {L: [
        {S: "I love the animations in this piece, showing abstractions of Kyrie Irving's exciting ball-handling skills. The piece effectively combines data visualization, animations, and in-game videos to paint a full picture of Irving's unique talent. However, I do think the interactive portion of the visualizations would work better as static - either through animation or a small multiples approach."}
      ]},
      link: {S: "http://www.espn.com/espn/feature/story/_/id/24504654/kyrie-irving-art-sick-handles-nba"}
    }
  ));

  vizEntries.push( new vizEntry(
    "Tracing the History of N.C.A.A. Conferences",
    new Date("12/1/2018 17:00"),
    "interactive viz",
    {
      publication: {S:"New York Times"},
      author: {SS: ["Mike Bostock","Shan Carter","Kevin Quealy"]},
      picture: {S: "http://graphics8.nytimes.com/newsgraphics/2013/11/30/football-conferences/71f2918fd830772afcf6433ebc6744b4e38ef94e/preview.png"},
      tags: {SS: ["sports","bostock"]},
      thoughts: {L: [
        {S: "The visualization technique here of a moving timeline with schools switching conferences in purple arrows is simple but effective at giving the landscape of conference sizes and movement over time. I particularly enjoy the hover and search bar to highlight a team and the narrative call-outs explaining interesting movements. The in-line bar chart demonstrating the decline in unaffiliated schools in the project intro is also a wonderfully subtle data viz nugget."}
      ]},
      link: {S: "http://www.nytimes.com/newsgraphics/2013/11/30/football-conferences/index.html"}
    }
  ));

  return vizEntries;
}

function loadYearInWeather() {
  let vizEntries = [];

  vizEntries.push (new vizEntry(
    "How Much Warmer Was Your City in 2017?",
    new Date("2018-11-29 20:00"),
    "interactive viz",
    {
      publication: {S: "New York Times"},
      author: {S: "K.K. Rebecca Lai"},
      link: {S: "https://www.nytimes.com/interactive/2018/01/21/world/year-in-weather.html#nyc"},
      picture: {S: "https://raw.githubusercontent.com/ryanabest/data-structures/master/week5/examples/year-in-weather.png"},
      tags: {SS: ["weather","classic","dense"]},
      thoughts: {L: [
        {S: "This reworking of the classic NYT graphic is still one of the more data dense visualizations I've ever seen, containing record high/low temps, normal high/low temps, actual high/low temps, and monthly precipitation all in one graphic. The subtle animations go a long way as well – the moving globe and object permanance of the visualization make for a really nice interative experience."}
      ]}
    }
  ));

  return vizEntries;
}

function loadInteractivesOne() {
  let vizEntries = [];

  vizEntries.push( new vizEntry(
    "The Birthday Paradox",
    new Date("2018-11-29 19:00"),
    "interactive viz",
    {
      publication: {S: "The Pudding"},
      author: {S: "Russell Goldenberg"},
      link: {S: "https://pudding.cool/2018/04/birthday-paradox/"},
      social: {S: "https://twitter.com/puddingviz/status/983329526779392001"},
      picture: {S: "https://pudding.cool/2018/04/birthday-paradox/assets/img/birthday-intro.png"},
      tags: {SS: ["animation","experiment","mathematics","anthropomorphism","crowd source","community"]},
      thoughts: {L: [
        {S: "This wonderful interactive experiment explains the mathematical concepts behind the statistical 'birthday paradox' with delightful animations. It also incorporates the interactions of past users to play out the concepts it explains in real time, which helps makes the piece feel really personal and engaging."}
        ,{S: "I love pretty much everything the Pudding produces, and this is one of the first pieces that got me excited about the site"}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "Gridlock in the Sky",
    new Date("2018-11-29 19:30"),
    "interactive viz",
    {
      publication: {S: "The Washington Post"},
      author: {SS: ["Chris Davenport","John Muyskens","Youjin Shin","Monica Ulmanu"]},
      social: {S: "https://twitter.com/JohnMuyskens/status/1072873947622973440"},
      link: {S: "wapo.st/busy-sky"},
      thoughts: { L: [
        {S: "This project maps how commercial rocket launches cause airlines to divert their paths, which causes delays in air traffic and increases fuel consumption, in a really compelling 3-D animation of individual flights around a specific SpaceX launch off the coast of Florida. The panning zoom in and out of the globe on scroll and animated flight paths / rocket launch paths is super successful in both telling this specific story and thoroughly impressing me from both a technology and design standpoint."}
      ]}
    }
  ));

  return vizEntries;
}

function loadStaticAndPortfolioEntries() {
  let vizEntries = [];

  // 538 World Cup
  vizEntries.push( new vizEntry(
    "How France And Croatia Made It To The World Cup Final, In One Chart",
    new Date("2018-11-09 19:00:00"),
    "static viz",
    {
      publication: {S: "FiveThirtyEight"},
      author: {S: "Rachael Dottle"},
      link: {S: "https://fivethirtyeight.com/features/how-france-and-croatia-made-it-to-the-world-cup-final-in-one-chart/"},
      social: {S: "https://twitter.com/fivethirtyeight/status/1018525597721612289"},
      picture: {S: "https://fivethirtyeight.com/wp-content/uploads/2018/07/dottle-wcpaths-11.png?w=1024"},
      thoughts: {L: [
        {S: "This information-rich chart combines an elimination bracket with in-game win probabilities based on FiveThirtyEight's model. I really love how this chart uses call-outs to both explain how to read the chart and interesting points in the data. I'd probably forego having individual player pictures within the graphic itself, as they don't add much to the data story we see, but overall this is a visually vibrant and dense graphic that tells the full story of the world cup all at once."}
        ,{S: "I remember watching the individual in-game match probabilities change during the group stages for the games I was actively watching and other games ongoing simultaneously, making sure to see when it might be exciting to switch from one game to another. Seeing this style for the knock-out stages all in one graphic is such a great way to bring that exprience full circle and remember specific moments throughout the exciting tournament."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "BallR: Interactive NBA Shot Charts with R and Shiny",
    new Date("2018-11-09 19:30:00"),
    "static viz",
    {
      author: {S: "Todd Schneider"},
      link: {S: "http://toddwschneider.com/posts/ballr-interactive-nba-shot-charts-with-r-and-shiny/"},
      social: {S: "https://twitter.com/todd_schneider/status/975738957702090752"},
      picture: {S: "http://toddwschneider.com/data/ballr/stephen-curry-2015-16-shot-chart-hexagonal.png"},
      thoughts: {L: [
        {S: "These beautiful, customizable NBA shot charts give a really great picture of individual players tendencies and skill levels, highlighting where they shoot the majority of their shots – and where they tend to make the most shots."}
        ,{S: "Todd Schneider has also open-sourced this project, allowing anyone to generate their own shot charts using an RShiny app and the NBA Stats API, which gives the location coordinates of every single shot taken during an NBA game since 1996."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "Data, R, and a 3-D Printer",
    new Date("2018-11-09 20:00:00"),
    "static viz",
    {
      author: {S: "Nathan Yau"},
      publication: {S: "FlowingData"},
      link: {S: "https://flowingdata.com/2018/05/01/data-r-and-a-3-d-printer/"},
      social: {S: "https://twitter.com/flowingdata/status/989184836060434432"},
      picture: {S: "https://i2.wp.com/flowingdata.com/wp-content/uploads/2018/04/Data-R-and-a-3-D-printer.jpg?w=2180&ssl=1"},
      thoughts: {L: [
        {S: "I absolutely love these 3-D NBA shot charts, turning each player's tendencies into their very own skyline. This is such a creative way to create a physical data visualization that highlights the differences between players really effectively."}
        ,{S: "Player styles really come across in these 3-D shot charts. For example, you can see how heavily Kevin Durant uses the mid-range, how dominant Lebron James is around the rim, and the incredible range of Steph Curry."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "Data Items: A Fashion Landscape at The Museum of Modern Art",
    new Date("2018-11-16 17:00:00"),
    "static viz",
    {
      author: {S: "Giorgia Lupi"},
      link: {S: "http://giorgialupi.com/data-items-a-fashion-landscape-at-the-museum-of-modern-art/"},
      picture: {S: "https://static1.squarespace.com/static/550de105e4b05c49fa2bba03/t/59e0d6a7c534a55da118a09e/1540227063486/?format=800w"},
      thoughts: {L: [
        {S: "This larger-than-life piece of data artwork stood twenty-feet tall accompanying the MoMA's Items: Is Fashion Modern exhibition. Containing an impressive amount of hand-drawn data-rich complexity never absent from Lupi's work, this piece tells the stories of the 111 pieces in the exhibition."}
        ,{S: "I particularly find the emphasis on walking museum-goers through some of the inspiration, themes, and ideas behind the curation process particularly interesting, since this is something that isn't necessarily often exposed to everyday patrons of an exhibition."}
        ,{S: "I was lucky enough to see this massive piece in person, and my first thought was 'this looks like Giorgia Lupi' – she's done an excellent job of creating a recognizable visual aesthetic and an easily discernable style."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "Accessibility Fireworks",
    new Date("2018-11-16 17:30:00"),
    "static viz",
    {
      author: {S: "Topi Tjukanov"},
      link: {S: "https://tjukanov.org/accessibility-fireworks/"},
      social: {S: "https://twitter.com/tjukanov/status/1012045288842973184"},
      data: {S: "https://mapple.fi/"},
      tools: {SS: ["PostGIS","QGIS with Time Manager plugin"]},
      picture: {S: "https://static1.squarespace.com/static/5a25370fc027d841ff016862/5a5224a19140b76bbfa6cf76/5b3e26342b6a28173378881a/1530799720625/metrop18_2.gif?format=800w"},
      thoughts: {L: [
        {S: "This animation compares how far you can travel in Helsinki using different modes of transport, comparing private car (pink), bicycling (yellow), and public transit (green). I could sit and watch this animation loop all day."}
        ,{S: "I wasn't quite sure if this belonged in static or interactive, but since it's an animation with no user input, I thought it was more appropriate here."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "Paris-Lyon Train Schedule of the 1880's",
    new Date("2018-11-16 18:00:00"),
    "static viz",
    {
      author: {S: "Etienne-Jules Marey"},
      picture: {S: "https://www.edwardtufte.com/bboard/images/0003zP-18548/VDQI_Pg116.jpg"},
      thoughts: {L: [
        {S: "This schedule of trains running between Paris and Lyon in the 1880's by E.J. Marey is a truly inventive graphic. Marey placed individual locations on the y-axis according to their geographic distance and time on the x-axis. With each line representing a specific train route, this graphic gives valuable detail on far and how fast each train travels, with density of the line representing the frequency of train routes over time. This is a great example of a clear, powerful representation of dense and complex information in one graphic. I do, however, agree with Tufte that the graphic is helped when we take down the prominence of the axes, as shown above."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry(
    "The Elements of Euclid",
    new Date("2018-11-23 17:00:00"),
    "static viz",
    {
      author: {S: "Oliver Byrne"},
      picture: {S: "https://cdn.taschen.com/media/images/1640/25_byrne_six_books_of_euclid_va_int_open_0070_0071_42827_1505261022_id_672889.jpg"},
      link: {S: "https://www.taschen.com/pages/en/catalogue/classics/all/42827/facts.oliver_byrne_the_first_six_books_of_the_elements_of_euclid.htm"},
      thoughts: {L: [
        {S: "19th-century mathematician Oliver Byrne's use of a bright color scheme and bold geometrical diagrams and symbols is not only quite gorgeous, but an incredibly valiant attempt to make explaining complex mathematical concepts more accessible. I loved the artistry in these mathematical proofs so much I went out and bought a recently published copy of the book myself."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry (
    "roadtolarissa",
    new Date("2018-11-23 17:30:00"),
    "portfolio",
    {
      author: {S: "Adam Pearce"},
      link: {S: "https://roadtolarissa.com/"},
      social: {S: "https://twitter.com/adamrpearce"},
      thoughts: {L: [
        {S: "Adam Pearce is beyond impressive and has created some of my favorite projects from the Times recently, especially his piece on <a href='https://www.nytimes.com/interactive/2018/05/09/nyregion/subway-crisis-mta-decisions-signals-rules.html'>New York's subway crisis</a> and <a href='https://www.nytimes.com/interactive/2017/08/24/us/hurricane-harvey-texas.html'>hurricane trackers</a>. His portfolio is set up in a really unorthodox way, with project previews set on a continual spiral that we can stop and control by scrolling. While his page may not follow typical information design standards, it really showcases his creative approach to data storytelling."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry (
    "Mike Bostock",
    new Date("2018-11-23 18:00:00"),
    "portfolio",
    {
      link: {S: "https://bost.ocks.org/mike/"},
      social: {S: "https://twitter.com/mbostock"},
      thoughts: {L: [
        {S: "I feel pretty much forever indebted to Mike Bostock, the creator of d3. Some of his earlier work with the Times shows how well he understands how to design and build compelling data stories on the web, while his more recent work on tools like d3 and Observable has pushed the whole data viz field forward by leaps and bounds."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry (
    "FlowingData",
    new Date("2018-11-30 17:00:00"),
    "portfolio",
    {
      link: {S: "https://flowingdata.com/"},
      author: {S: "Nathan Yau"},
      social: {S: "https://twitter.com/flowingdata"},
      picture: {S: "https://flowingdata.com/wp-content/themes/fd-modern-5-8-2/images/logo-v2d.png"},
      thoughts: {L: [
        {S: "More a blog than a typical 'portfolio', FlowingData is probably the best resource out there for all things data viz. Nathan Yau's interactive stories are concise, visually impressive, and prioritize insight above all else. Nathan also provides great tutorials and how-to's, some of which are placed behind a members only paywall."}
      ]}
    }
  ));

  vizEntries.push( new vizEntry (
    "Daniel Goddemeyer",
    new Date("2018-11-30 17:30:00"),
    "portfolio",
    {
      link: {S: "http://danielgoddemeyer.com/"},
      social: {S: "https://twitter.com/dgoddemeyer"},
      thoughts: {L: [
        {S: "I really enjoy Daniel Goddemeyer's design projects that stack images and colors into a horizontal palette to tell a broad, ambitious story without losing the detail of a specific moment along that timeline. I particularly like <a href='http://on-broadway.nyc/'>On Broadway</a>, an interactive installation that complies pictures taken and data collected along Broadway in Manhattan."}
      ]}
    }
  ));

  return vizEntries;
}

function loadTruthAndBeauty() {
  let vizEntries = [];
  vizEntries.push( new vizEntry (
    "Truth & Beauty",
    new Date("2018-11-30 18:00:00"),
    "portfolio",
    {
      link: {S: "https://truth-and-beauty.net/"},
      author: {S: "Moritz Stefaner"},
      social: {S: "https://twitter.com/moritz_stefaner"},
      picture: {S: "https://raw.githubusercontent.com/ryanabest/data-structures/master/week5/examples/TruthAndBeauty.png"},
      thoughts: {L: [
        {S: "Mortiz is an impressive data visualization specialist. His projects are incredibly data-rich and visually stunning. He also has a great data visualization podcast, Data Stories."}
      ]}
    }
  ));
  return vizEntries;
}

function loadHumanTerrian() {
  let vizEntries = [];
  vizEntries.push( new vizEntry(
    "Human Terrain",
    new Date("2018-11-01 19:50:51"),
    "interactive viz",
    {
      publication: {S: "The Pudding"},
      author: {S: "Matt Daniels"},
      link: {S: "https://pudding.cool/2018/10/city_3d/"},
      tags: {SS: ["mapping","3D","MapBox","interactive","guided narrative", "exploratory"]},
      social: {S: "https://twitter.com/puddingviz/status/1055505311585497090"},
      picture: {S: "https://pudding.cool/2018/10/city_3d/assets/social/social_facebook.png"},
      documentation: {S: "https://blog.mapbox.com/3d-mapping-global-population-density-how-i-built-it-141785c91107"},
      thoughts: {L: [
        { S: "Beautiful use of MapBox and 3D visualization shows the physical density of the human population around the world, creating new city-scapes that represent the world's biggest urban areas." }
        ,{ S: "I am impressed with the technical execution of this piece, which brings together such a massive amount of data into a seamless expreience - the load times could be better, but I'm impressed with how good they are." }
        ,{ S: "This project excels at providing both a guided narrative and an exploratory tool, which is quite rarely executed so well as it is here." }
      ]}
    }
  ));
  return vizEntries;
}

function bloombergMidtermCartogram() {
  let vizEntries = [];

  vizEntries.push( new vizEntry (
    "Election 2018: The Races to Watch and How to Follow Them",
    new Date("2018-11-03 17:28:29"),
    "interactive viz",
    {
      publication: {S: "Bloomberg"},
      author: {SS: ["Allison McCartney","Brittany Harris","Mira Rojanasakul","Dean Halford","Julian Burgess"]},
      link: {S: "https://www.bloomberg.com/graphics/2018-midterm-election-results/"},
      tags: {SS: ["politics","election2018","mapping","cartogram"]},
      picture: {S: "https://raw.githubusercontent.com/ryanabest/data-structures/master/week5/examples/Bloomberg%20Midterm%20Cartogram.png"},
      social: {S: "https://twitter.com/BBGVisualData/status/1058385290073493505"},
      thoughts: {L: [
        { S: "The cartogram view in this project does a great job of giving equal weight to each specific race, visually emphasizing each seat and not geography, while still maintaining general geographic relationships so I understand what I'm looking at - it successfully still LOOKS like a map but doesn't overemphasize physcial space like a typical map does." }
        ,{ S: "It does a great job of laying out each race but doesn't succeed as much in visually distinguishing the 'races to watch' in the cartogram as much as I'd hoped - I'd explore changing the color of the district to the likelihood of the winning party instead of incumbent party or an option to change the opacity of a district based on the competitiveness of the race there (with more competitive races being more opaque, thereby being visually distinguished a bit more)." }
        ,{ S: "I really enjoy how hovering over a state in the House cartogram breaks up the area into each district, labled with the district number. I also think this hover-over tooltip is well designed for the limited information it portrays - but % chance of winning for each candidate might be helpful and wouldn't clutter the design." }
        ,{ S: "The cartogram design is wonderful and portrays the national election landscape in a clear way, but I think there could be improvements to how much information is communicated in this visual, specifically in the color/opacity choices of each district." }
      ]}
    }
  ));

  return vizEntries;
}

function dayInTheLife() {
  let vizEntries = [];

  vizEntries.push( new vizEntry (
    "NYC Taxis: A Day in the Life",
    "October 19, 2018",
    "interactive viz",
    {
      link: {S: "https://chriswhong.github.io/nyctaxi/"},
      author: {S: "Chris Wong"},
      author_page: {S: "https://chriswhong.com/"},
      thoughts: {L: [
          { S: "I love this project - it's such a fun exploration of one random taxi driver's shift in New York. We watch our driver take us from place to place and see how many trips and fares they've accumulated throughout the day." }
        ,{ S: "I particularly enjoy how Chris keeps the taxi dot static and moves the map behind this point, while behind the paths of each passenger's trip and continually filling up the map based on where this taxi traveled while the meter was running. This approach really makes the map look and feel alive and gives each taxi a unique footprint on the map." }
        ,{ S: "I would have really liked to see visualizations of this data at the next level higher, combining data from multiple taxis in the dataset - was the taxi trip I just watched indicative of the norm across all taxis? How many taxis earned less over the same time span? More? Which taxis covered the most ground? These questions are somewhat out of the scope of this exploratory project, but I think exploring them would provide useful context and make this project much more cohesive and exhaustive." }
        ,{ S: "I ended up drawing a lot of inspriation from this animated map approach, using this project as a jumping off point for my Migration of Art project from my Major Studio I course last year. Chris's technical and design appendices helped me out a ton!" }
        ,{ S: "Without speeding up the animation speed, it also takes a bit of a long time to get through a whole taxi shift, which I think is a bit of a missed opportunity. The path this taxi has driven at the end of its shift, filled with individual fares and passengers, forms an interesting and unique shape - this aspect of the visualization was sacrificed a bit for the sake of the animation." }
      ]},
      tags: {SS:["animation","mapping","LeafLet","New York"]},
      awards: {S: "Information is Beautiful Awards 2014 - Best Motion Infographic - Gold"},
      picture: {S: "https://iibawards-prod.s3.amazonaws.com/projects/images/000/000/594/large.jpg?1467151682"}
    }
  ));

  return vizEntries;
}

function loadNYTFacesOfDiversity() {
  let vizEntries = [];

  vizEntries.push( new vizEntry (
    "The Faces of Change in the Midterm Elections",
    new Date("2018-11-01 19:37:30"),
    "interactive viz",
    {
      publication: {S: "New York Times"},
      author: {SS: ["K.K. REBECCA LAI", "DENISE LU", "LISA LERER","TROY GRIGGS"]},
      link: {S: "https://www.nytimes.com/interactive/2018/10/31/us/politics/midterm-election-candidates-diversity.html"},
      tags: {SS:["politics","election2018","scrollytelling"]},
      pubDate: {S: new Date("October 31, 2018").toDateString()},
      social: {S: "https://twitter.com/nytgraphics/status/1057667207809978368"},
      picture: {S: "https://raw.githubusercontent.com/ryanabest/data-structures/master/week5/examples/FacesOfChange.png"},
      thoughts: {L: [
        { S: "The use of candidates' faces as individual data points that stack up as parts of a whole is a really inventive and effective method for this piece. This mechanism allows the differences (or similarities) between skin tones, genders, and styles to become visually apparent as we compare subsets of the candidate pool - showing exactly the mechanisms this piece hopes to portray. Additionally, as groups become smaller in number, the faces of candidates in these groups become bigger and clearer, allowing us to physically see who it is that is challenging the status quo and representing the fight for inclusiveness in politics."}
        ,{ S: "The animation really helps us get a sense of scale as the statistics and groups we look at change."}
        ,{ S: "The authors transition well between animated scrollytelling and narrative using a consistent visual language, using the same face cutouts to introduce individual candidates in detail and populate an effective 2x2 matrix of candidate breakdown by party and white men / others." }
        ,{ S: "It doesn't seem like different faces occupy different areas when used as parts of a whole in data visualizations, staying true to having equal data represent equal space on the page and avoiding any potential misrepresentation of data." }
        ,{ S: "The biggest change I would suggest in this piece is starting out with every candidate's face on the page at once, then narrowing down to specific candidates/groups instead of starting more granular (with 28 more detailed faces on the screen, then zooming out). This change would really allow me to get a better sense of scale from the get-go - these candidates are among the most diverse set to run in elections, but what proportion of them represent a minority or under-represented group? This change would allow the piece to start off with insight, with the first visual being data-driven as opposed to only orienting me to the project style. This approach may lose the personal touch of seeing detailed faces at the beginning, but it would be a change I'd like to explore." }
      ]}
    }
  ));

  return vizEntries;
}

function recordNumberOfWomen() {
  let vizEntries = [];

  vizEntries.push( new vizEntry (
    "Record Numbers of Women Running for Office May Not Mean Big Gains in Congress",
    "October 21, 2018",
    "interactive viz",
    {
      link: {S: "https://www.bloomberg.com/graphics/2018-women-candidates/"},
      pubDate: {S: new Date("May 7, 2018").toDateString()},
      publication: {S: "Bloomberg"},
      thoughts: {L: [
         { S: "I chose this project as a scrollytelling comparison with the Land Use Bloomberg project, but it's also a great example of how multiple visualizations provide comprehensive support to a well written story." }
        ,{ S: "There is a great visual connection between the text and the graphic, as the yellow highlighting in the text matches the yellow highlighting in the graphic. This scrollytelling also walks us through a much more linear narrative than the Land Use example. As possible seats won by women are whittled down, we see the graphic update accordingly. In the Land Use example there wasn't as much of a linear progression in how the graphic changed through each state, as the color and visualization method jumped around a bit more." }
        ,{ S: "I particularly enjoy the visual showing how the percentage of candidates who are women has shifted between 2000-2016 averages and 2018 levels. Plotting each point and showing the magnitude and direction of that movement visually is a really effective way to get a lot of information all at once without sacrificing aesthetics." }
        ,{ S: "Small multiples is used effectively here to see how the map has changed through recent years. However, I'd be interested to see how scrollytelling could be implemented here to make this point a little clearer - this visualization and story follows the same tenants that made scrollytelling so effective in the last vis on this page. I also think flipping the chronological order of these maps and showing the most recent map first is more confusing than it is intuitive." }
      ]},
      tags: {SS:["visualization","scrollytelling","small multiples","mapping","politics"]}
    }
  ));

  return vizEntries;
}


function loadFirstVizEntries() {

  let vizEntries = [];

  vizEntries.push( new vizEntry (
    "Extensive Data Shows Punishing Reach of Racism for Black Boys",
    "October 10, 2018",
    "interactive viz",
    {
      publication: {S: "New York Times (The Upshot)"},
      author: {SS: ["Emily Badger", "Claire Cain Miller", "Adam Pearce", "Kevin Quealy"]},
      link: {S: "https://www.nytimes.com/interactive/2018/03/19/upshot/race-class-white-and-black-men.html"},
      thoughts: {L: [
         { S: "Use of multiple animated visualizations isn't animation for animation's sake - it serves as a useful and intuititve explanation of concepts and an effective tool that facilitates a cohesive story." }
        ,{ S: "I would have liked to see options to either speed up the animated visualization or see what the sankeychart would look like in static form, allowing users to interpret these findings from multiple angles and at different levels of detail." }
        ,{ S: "The story itself is a sobering portrayal of societal issues of economic immobility for black men in the U.S, bringing new in-depth analysis and extensive data to an ever-important and oft-overlooked conversation in our national landscape." }
      ]},
      tags: {SS:["animation","storytelling","politics","sankey","race"]},
      pubDate: {S: new Date("March 19, 2018").toDateString()},
      social: {S: "https://twitter.com/UpshotNYT/status/975774912764882946"},
      picture: {S: "https://raw.githubusercontent.com/ryanabest/data-structures/master/week5/examples/O_tw_rUu.jpeg"}
    }
  ))

  vizEntries.push( new vizEntry (
    "The Rhythm Of Food",
    "October 11, 2018",
    "interactive viz",
    {
      author: {S: "Moritz Stefaner"},
      thoughts: {L: [
        { S: "Moritz really nails the narrative structure here in how he explains his use of a novel visualization technique that could be hard to understand, walking us through how to interpret the rest of the piece an engaging and intuitive way." }
        ,{ S: "Also does a great job of highlighting the interesting graphics at once, which provides real analytic insight early on in the project, and in calling out interesting points within a graphic, adding context that aids in our understanding." }
        ,{ S: "'It's October, what is being asked for now?' is a nice touch that grounds the project in the current experience of its user and anticipating the user's needs or interests from this project." }
      ]},
      tags: {SS:["visualization","storytelling","explorative","food","timeline","cyclical","gradient"]},
      link: {S: "http://rhythm-of-food.net/"},
      documentation: {S: "https://truth-and-beauty.net/projects/the-rhythm-of-food"},
      awards: {S: "Information is Beautiful Awards 2017 - Gold"},
      picture: {SS: [
        "https://truth-and-beauty.net/content/1-projects/30-the-rhythm-of-food/01-apricot-highlight.png"
        ,"https://truth-and-beauty.net/content/1-projects/30-the-rhythm-of-food/02-elderberry.png"
        ,"https://truth-and-beauty.net/content/1-projects/30-the-rhythm-of-food/02-charts-02.png"
      ]},
      video: {S: "https://vimeo.com/193889103"}
    }
  ))

  vizEntries.push( new vizEntry (
    "Visual Cinnamon - Nadieh Bremer",
    "October 21, 2018",
    "portfolio",
    {
      author: {S: "Nadieh Bremer"},
      thoughts: {L: [
        { S: "Nadieh Bremer has such an impressive portfolio of projects - she's got a wonderful eye for visual design and takes such expansive data sets and crafts really effective, beautiful visualizations from them." }
        ,{ S: "Her portfolio quite effectively showcases the visuals of her projects, focusing primarily on images of her output, while providing well crafted project intros, with a one paragraph project description and the overview of project specs / tools / data." }
        ,{ S: "She provides a great peek into her inspiration, thought process, and goals for each piece, giving high level context behind the big decisions she made." }
        ,{ S: "Also hidden in these project pages are links to more detailed blogs, posted on www.datasketch.es (a collaboration between her and software engineer & data visualizer Shirley Wu), which give exhaustive overviews on her entire process from inspiration through design sketches and coding." }
        ,{ S: "I think breaking these two pieces apart is really smart - it allows her to shine a light on the beautiful visual output of her work without bogging this page down with lengthy text without completely losing that useful detail." }
      ]},
      tags: {SS:["portfolio","visualization","documentation","process"]},
      awards: {S: "Information is Beautiful Awards 2017 - Best Individual"},
      picture: {S: "https://github.com/ryanabest/data-structures/blob/master/week5/examples/VisualCinnamon.png?raw=true"},
      link: {S: "https://www.visualcinnamon.com/portfolio/"},
      example_project_link: {SS: ["https://www.visualcinnamon.com/portfolio/figures-in-the-stars","http://www.datasketch.es/may/"]}
    }
  ))

  vizEntries.push( new vizEntry (
    "Here's How America Uses Its Land",
    "October 20, 2018",
    "interactive viz",
    {
      link: {S: "https://www.bloomberg.com/graphics/2018-us-land-use/"},
      pubDate: {S: new Date("July 31, 2018").toDateString()},
      publication: {S: "Bloomberg"},
      author: {S: "Dave Merrill and Lauren Leatherby"},
      thoughts: {L: [
         { S: "I like the novel approach to data visualization here - this project uses the outline of the continental United States both as a map (showing where land is used for particular purposes) and as axes for visualizations (filling in this outline with percentages of a whole, for example)." }
        ,{ S: "This project is an interesting application of scrollytelling, and I think it works here since the background graphic stays consistent while scrolling progresses the user through different instances of that same base visual, instead of repeating that visual with text inbetween or showing those states as small multiples." }
        ,{ S: "Using the map as a background for visualization somewhat forces the author here into using a lot of tree maps or tree map-like charts, which I do NOT particularly care for. I think for me the lack of a shared axis makes it quite hard to compare across categories and these charts are only really useful when they're labeled - they're just a step above pie charts in this respect." }
        ,{ S: "There's also some wonkiness with which state of the of background graphic shows up and when that state changes. At times is doesn't seem totally synced up with the explanatory text in the front of the screen. The map also renders frustratingly off-center for me, with extra white spae at the top of the screen with the tip of Texas cut off." }
      ]},
      tags: {SS:["scrollytelling","mapping"]}
    }
  ))

  vizEntries.push( new vizEntry (
    "Generative WorldCup",
    "October 21, 2018",
    "static viz",
    {
      link: {S: "http://zehfernandes.com/generativeworldcup2018/"},
      author: {S: "Zeh Fernandes"},
      tags: {SS: ["generative art","sports","art","poster","graphic design","abstract"]},
      thoughts: { L: [
         { S: "These posters are quite beautiful representations of an entire soccer game and pack a lot of statistics into one abstract visual." }
        ,{ S: "The methodology and meaning behind the specific representations of data are a bit hard to follow and aren't sufficiently documented." }
        ,{ S: "However, aesthetics seem to be more important than their use to actually understand what happened in the game, considering these pieces are generative art posters and aren't being used for analysis." }
        ,{ S: "I still would have added a 'how to read this' section that details what each section portrays that allows the audience to learn more about the game itself outside of appreciating the beauty of each poster. This is the main aspect missing from these pieces more closely resembling something that Giorgia Lupi would make." }
      ]},
      image: {SS: ["https://pbs.twimg.com/media/DgakD9JX0AErvtN.jpg","https://pbs.twimg.com/media/DgaqvdfW4AA9f8H.jpg"]}
    }
  ))

  // vizEntries.push(loadNYTFacesOfDiversity());
  // vizEntries.push(loadHumanTerrian());
  // vizEntries.push(bloombergMidtermCartogram());

  return vizEntries;
}
