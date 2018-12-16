# Data Structures Final Projects
### Fall 2018, Parsons School of Design
#### Professor: [Aaron Hill](https://github.com/aaronxhill)

The working app housing the endpoints and front-end interfaces for all three of my final projects can be accessed __[here](http://data-structures-final-dev.us-east-1.elasticbeanstalk.com/)__. The __endpoints__ link routes to three individual endpoints that were not explicitly used in final interfaces but served as the starting-point for interface development, which I built for [weekly assignment 10](https://github.com/visualizedata/data-structures/tree/master/assignments/weekly_assignment_10). This app was built in [express](https://expressjs.com/en/starter/generator.html) with support from [handlebars](https://webapplog.com/handlebars/) and was stood up using [AWS](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html) [Elastic](https://medium.freecodecamp.org/how-to-deploy-a-node-js-app-to-the-aws-elastic-beanstalk-f150899ed977) [Beanstalk](https://medium.com/@xoor/deploying-a-node-js-app-to-aws-elastic-beanstalk-681fa88bac53).

## Final Projects
Each final project has its own documentation page (within the [READMEs](READMEs) folder) covering decisions and assumptions made during interface design and development, the back-end data queries that serve data based on those decisions and assumptions, mapping of the data served from these queries to the visualization, and any next steps I'd like to pursue for each project (that would be outside the scope of this course):

+ [Final Project 1: Alcoholics Anonymous Meeting Finder](READMEs/aa.md)
+ [Final Project 2: Diary of Envy](READMEs/diary.md)
+ [Final Project 3: How Well Insulated Am I From The Temperature Outside?](READMEs/sensor.md)

## Bringing Data Into Front-End Interfaces

My approach in bringing data from the database into the front-end interfaces for each project was:

1. Write all front-end JS code inside _script_ tags within each _views/project.hbs_ handlebars html template – this made it easy to pass handlebars variables directly into my front-end JS code

2. Initialize an empty list in my front-end JS code, adding a handlebars variable after that empty list:

```javascript
let mapMarkers = [];
{{{markers}}}
// {{{markers}}} is a handlebars variable that will be populated with JS code to populate the mapMarkers list
```

3. Query data in client-end JS code (_routes/project.js_), returning the minimal amount of data needed based on what will display on the front-end page (either through the default view or after user inputs), with __every row of data returned__ being rendered somehow on the front-end interface.

4. Write a string of text that will be passed into my handlebars variable (within _script_ tags) as front-end JS code to execute when the app is loaded. Populate this text by looping through each row of  data returned from my database queries, adding a _list.push_ command for that row of data:

```javascript
let markers = '';
// this variable will be the JS code that will populate an existing list with all my individual marker data
let aaMeetings = qres.rows;
// this should be a list that returns one row per geoLocation
client.end();
for (let a=0;a<aaMeetings.length;a++) {
      let meeting = aaMeetings[a];
      markers += 'mapMarkers.push('+JSON.stringify(aaMeetings[a])+');'
      // this will add JS code ot the markers variable that pushes each individual data point into the empty mapMarkers list
}
```

5. Pass that string of text into the handlebars variable I established in the front-end _hbs_ file, so that when the page is loaded each individual row gets pushed into the list I established on the front-end:

```javascript
res.render('aa', {title: 'AA Interface', hours: hours, miles: miles, markers: markers})
//In this case the markers variable is the string I populated with a mapMarkers.push() for each row of data
```

6. Use the now populated list in my front-end code to generate each visualization
