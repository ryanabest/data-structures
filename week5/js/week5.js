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
    "October 10, 2018",
    "interactive viz",
    {
      publication: {S: "New York Times (The Upshot)"},
      author: {SS: ["Emily Badger", "Claire Cain Miller", "Adam Pearce", "Kevin Quealy"]},
      link: {S: "https://www.nytimes.com/interactive/2018/03/19/upshot/race-class-white-and-black-men.html"},
      thoughts: {SS: [
         "Use of multiple animated visualizations isn't animation for animation's sake - it serves as a useful and intuititve explanation of concepts and an effective tool that facilitates a cohesive story."
        ,"I would have liked to see options to either speed up the animated visualization or see what the sankeychart would look like in static form, allowing users to interpret these findings from multiple angles and at different levels of detail."
        ,"The story itself is a sobering portrayal of societal issues of economic immobility for black men in the U.S, bringing new in-depth analysis and extensive data to an ever-important and oft-overlooked conversation in our national landscape."
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
      thoughts: {SS: [
        "Moritz really nails the narrative structure here in how he explains his use of a novel visualization technique that could be hard to understand, walking us through how to interpret the rest of the piece an engaging and intuitive way."
        ,"Also does a great job of highlighting the interesting graphics at once, which provides real analytic insight early on in the project, and in calling out interesting points within a graphic, adding context that aids in our understanding."
        ,"'It's October, what is being asked for now?' is a nice touch that grounds the project in the current experience of its user and anticipating the user's needs or interests from this project."
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
      thoughts: {SS: [
        "Nadieh Bremer has such an impressive portfolio of projects - she's got a wonderful eye for visual design and takes such expansive data sets and crafts really effective, beautiful visualizations from them."
        ,"Her portfolio quite effectively showcases the visuals of her projects, focusing primarily on images of her output, while providing well crafted project intros, with a one paragraph project description and the overview of project specs / tools / data."
        ,"She provides a great peek into her inspiration, thought process, and goals for each piece, giving high level context behind the big decisions she made."
        ,"Also hidden in these project pages are links to more detailed blogs, posted on www.datasketch.es (a collaboration between her and software engineer & data visualizer Shirley Wu), which give exhaustive overviews on her entire process from inspiration through design sketches and coding."
        ,"I think breaking these two pieces apart is really smart - it allows her to shine a light on the beautiful visual output of her work without bogging this page down with lengthy text without completely losing that useful detail."
      ]},
      tags: {SS:["portfolio","visualization","documentation","process"]},
      awards: {S: "Information is Beautiful Awards 2017 - Best Individual"},
      picture: {S: "https://github.com/ryanabest/data-structures/blob/master/week5/examples/VisualCinnamon.png?raw=true"},
      link: {S: "https://www.visualcinnamon.com/portfolio/"},
      example_project_link: {SS: ["https://www.visualcinnamon.com/portfolio/figures-in-the-stars","http://www.datasketch.es/may/"]}
    }
  ))

  vizEntries.push( new vizEntry (
    "NYC Taxis: A Day in the Life",
    "October 19, 2018",
    "interactive viz",
    {
      link: {S: "https://chriswhong.github.io/nyctaxi/"},
      author: {S: "Chris Wong"},
      author_page: {S: "https://chriswhong.com/"},
      thoughts: {SS: [
        "I love this project - it's such a fun exploration of one random taxi driver's shift in New York. We watch our driver take us from place to place and see how many trips and fares they've accumualted throughout the day."
        ,"I particularly enjoy how Chris keeps the taxi dot static and moves the map behind this point, while behind the paths of each passenger's trip and continually filling up the map based on where this taxi traveled while the meter was running. This approach really makes the map look and feel alive and gives each taxi a unique footprint on the map."
        ,"I would have really liked to see visualizations of this data at the next level higher, combining data from multiple taxis in the dataset - was the taxi trip I just watched indicative of the norm across all taxis? How many taxis earned less over the same time span? More? Which taxis covered the most ground? These questions are somewhat out of the scope of this exploratory project, but I think exploring them would provide useful context and make this project much more cohesive and exhaustive."
        ,"I ended up drawing a lot of inspriation from this animated map approach, using this project as a jumping off point for my Migration of Art project from my Major Studio I course last year. Chris's technical and design appendices helped me out a ton!"
        ,"Without speeding up the animation speed, it also takes a bit of a long time to get through a whole taxi shift, which I think is a bit of a missed opportunity. The path this taxi has driven at the end of its shift, filled with individual fares and passengers, forms an interesting and unique shape - this aspect of the visualization was sacrificed a bit for the sake of the animation."
      ]},
      tags: {SS:["animation","mapping","LeafLet","New York"]},
      awards: {S: "Information is Beautiful Awards 2014 - Best Motion Infographic - Gold"},
      picture: {S: "https://iibawards-prod.s3.amazonaws.com/projects/images/000/000/594/large.jpg?1467151682"}
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
      thoughts: {SS: [
         "I like the novel approach to data visualization here - this project uses the outline of the continental United States both as a map (showing where land is used for particular purposes) and as axes for visualizations (filling in this outline with percentages of a whole, for example)."
        ,"This project is an interesting application of scrollytelling, and I think it works here since the background graphic stays consistent while scrolling progresses the user through different instances of that same base visual, instead of repeating that visual with text inbetween or showing those states as small multiples."
        ,"Using the map as a background for visualization somewhat forces the author here into using a lot of tree maps or tree map-like charts, which I do NOT particularly care for. I think for me the lack of a shared axis makes it quite hard to compare across categories and these charts are only really useful when they're labeled - they're just a step above pie charts in this respect."
        ,"There's also some wonkiness with which state of the of background graphic shows up and when that state changes. At times is doesn't seem totally synced up with the explanatory text in the front of the screen. The map also renders frustratingly off-center for me, with extra white spae at the top of the screen with the tip of Texas cut off."
      ]},
      tags: {SS:["scrollytelling","mapping"]}
    }
  ))

  vizEntries.push( new vizEntry (
    "Record Numbers of Women Running for Office May Not Mean Big Gains in Congress",
    "October 21, 2018",
    "interactive viz",
    {
      link: {S: "https://www.bloomberg.com/graphics/2018-women-candidates/"},
      pubDate: {S: new Date("May 7, 2018").toDateString()},
      publication: {S: "Bloomberg"},
      thoughts: {SS: [
         "This project is also an effective use of scrollytelling, with a graphic that stays consistent as we progress through different states."
        ,"However, there are a couple reasons why I think this is a slightly better implementation of scrollytelling than Bloomberg's Land Use example. There is more of a visual connection between the text and the graphic, as the yellow highlighting in the text matches the yellow highlighting in the graphic. This scrollytelling also walks us through a much more linear narrative than the Land Use example. As possible seats won by women are whittled down, we see the graphic update accordingly. In the Land Use example there wasn't as much of a linear progression in how the graphic changed through each state, as the color and visualization method jumped around a bit more."
        ,"I chose this project as a scrollytelling comparison with the Land Use Bloomberg project, but it's also a great example of how multiple visualizations provide comprehensive support to a well written story."
        ,"I particularly enjoy the visual showing how the percentage of candidates who are women has shifted between 2000-2016 averages and 2018 levels. Plotting each point and showing the magnitude and direction of that movement visually is a really effective way to get a lot of information all at once without sacrificing aesthetics."
        ,"Small multiples is used effectively here to see how the map has changed through recent years. However, I'd be interested to see how scrollytelling could be implemented here to make this point a little clearer - this visualization and story follows the same tenants that made scrollytelling so effective in the last vis on this page. I also think flipping the chronological order of these maps and showing the most recent map first is more confusing than it is intuitive."
      ]},
      tags: {SS:["visualization","scrollytelling","small multiples","mapping","politics"]}
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
      thoughts: { SS: [
        "These posters are quite beautiful representations of an entire soccer game and pack a lot of statistics into one abstract visual."
        ,"The methodology and meaning behind the specific representations of data are a bit hard to follow and aren't sufficiently documented."
        ,"However, aesthetics seem to be more important than their use to actually understand what happened in the game, considering these pieces are generative art posters and aren't being used for analysis."
        ,"I still would have added a 'how to read this' section that details what each section portrays that allows the audience to learn more about the game itself outside of appreciating the beauty of each poster. This is the main aspect missing from these pieces more closely resembling something that Giorgia Lupi would make."
      ]},
      image: {SS: ["https://pbs.twimg.com/media/DgakD9JX0AErvtN.jpg","https://pbs.twimg.com/media/DgaqvdfW4AA9f8H.jpg"]}
    }
  ))

  return vizEntries;
}
