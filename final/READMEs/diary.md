# Final Project 2: Diary of Envy
This project combines weekly assignments
[5](https://github.com/ryanabest/data-structures/tree/master/week5), [6](https://github.com/ryanabest/data-structures/tree/master/week6), [7](https://github.com/ryanabest/data-structures/tree/master/week7), [10](https://github.com/ryanabest/data-structures/tree/master/final) _(contained within final project folder in 'endpoints' files)_, and [11](https://github.com/ryanabest/data-structures/tree/master/week11) to produce a blog-style web interface cataloging some of my favorite data visualizations and portfolio using a semi-structured, qualitative [data structure](https://github.com/ryanabest/data-structures/blob/master/week5/data-structures_week5.md).

__[Final Interface](http://data-structures-final-dev.us-east-1.elasticbeanstalk.com/diary)__

## User Needs and Assumptions
This project is designed to be a simple running list of entries with a broad overview of the specific entry, essentially giving a broad sense of what the entry is and why I wanted to include it. The most important information to relay to users of this interface are:

+ Name of the project/portfolio
+ Publication
+ Author(s)
+ Preview image/gif
+ My general thoughts (why I included this specific item)
+ External link to project/portfolio
+ Twitter post sharing this item from the author or publication

Each of these elements outside of preview images and gifs should all be _text elements_ organized in a clear and intuitive hierarchy (which will follow the order listed above). These data should be sufficient to give users a broad sense of what each individual item is, what it looks like, why I liked it, how the authors or publication shared this piece, and where users can go to explore this piece themselves in more detail. All dairy entries should include the majority of the data points listed above but only date added, project name, and entry category are explicitly required. Since any entry can include any subset of these elements, the front-end design needs to be flexible enough to handle entries with a different number of elements present.

Entries are split into three categories, __interactive visualization__, __static visualization__, and __portfolio__. A key user assumption I'm making is that a user will only want to see entries from one of these categories at a time. I'll be presenting entries in reverse order of when I added them to this diary (meaning the newest additions to the list will come up first, then proceed in descending order). I'm also assuming that it is _not_ relevant for users to know exactly when I added each element, but this assumption could change if I would continue to add posts over a long period of time or had a growing user base that would expect new content on a regular basis.

## Query Structure

The key user assumptions I've made around serve as the foundation for my query structure. These fields comprise the organizing structure of my underlying DynamoDB database, with __project category__ serving as my partition key and __date added__ to the diary serving as my sort key. So, in my back-end [database query](https://github.com/ryanabest/data-structures/blob/master/final/routes/sensor.js) I pull in projects that match the current project category selection (defaulted to _interactive visualization_ with a user option to change to either _static visualization_ or _portfolio_) that were added on or before October 1, 2018 (when this project started). This date requirement is not actually completely necessary from a design perspective, since it neither changes nor limits which data is returned from the database. However, it's required from a technical perspective – since I made date added the sorting key of my noSQL element, I need to include it in my query to get a valid response. This date restriction would become more relevant if I wanted to limit my query to only give posts made within the last month or let the user determine which range of dates to pull entries from, for example.

This query will only return data that matches the product category selected, ensuring the minimal amount of data needed is retrieved from the database. When a user changes the product category they want to see, the page is re-rendered and a new query is executed returning only those entries that match the category chosen.

## Visual Representation of Data

I create an HTML div for each "row" returned from my query, using each element listed in the User Needs and Assumptions to generate a nested HTML element if that data point is present within the specific "row" returned from the query response:

+ Name of the project/portfolio &#8594; __h1__
+ Publication &#8594; __h2__ with class 'publication'
+ Author(s) &#8594; __h2__ with class 'author'
+ Preview image/gif &#8594; __img__
+ My general thoughts (why I included this specific item) &#8594; __p__ with class 'thoughts'
+ External link to project/portfolio &#8594; __a__ with class 'project-link' nested inside a p element
+ Twitter post sharing this item from the author or publication &#8594; __a__ resembling twitter icon using [font awesome](https://fontawesome.com/)

If one of these data points isn't present in the returned data, the HTML element specific to that data point isn't created. These elements are given classes and id's that are given styles in CSS to create a clear hierarchy of information and make each post look visually consistent:

![Default interface view showing an example interactive viz][diary1]

[diary1]: images/diary1.png "Default interface view showing an example interactive viz"

The __default view__ for this interface shows interactive visualizations, with ALL interactive viz entries shown in descending order (from when I added them into the database). Interactive visualization is the most exciting category of the three to me personally and this default most closely relates to pages with similar perspectives, like these examples from [Bloomberg](https://www.bloomberg.com/features/2017-jealousy-list/), [FiveThirtyEight](https://fivethirtyeight.com/features/damn-we-wish-wed-done-these-5-stories-this-month-2/), and [FlowingData](https://flowingdata.com/2017/12/28/10-best-data-visualization-projects-of-2017/).
