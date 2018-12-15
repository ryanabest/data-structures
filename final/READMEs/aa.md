# Final Project 1: Alcoholics Anonymous Meeting Finder
This project combines weekly assignments [1](https://github.com/ryanabest/data-structures/tree/master/week1), [2](https://github.com/ryanabest/data-structures/tree/master/week2), [3](https://github.com/ryanabest/data-structures/tree/master/week3), [4](https://github.com/ryanabest/data-structures/tree/master/week4), [6](https://github.com/ryanabest/data-structures/tree/master/week6), [7](https://github.com/ryanabest/data-structures/tree/master/week7), [10](https://github.com/ryanabest/data-structures/tree/master/final) _(contained within final project folder in 'endpoints' files)_, and [11](https://github.com/ryanabest/data-structures/tree/master/week11) to repurpose New York Alcoholics Anonymous meeting schedules into a new front-end map-based interface showing relevant geolocations as map markers with location and schedule information about each meeting at that geolocation accessible though a pop-out pane.

__[Final Interface](http://data-structures-final-dev.us-east-1.elasticbeanstalk.com/aa)__

## User Needs and Assumptions

This project assumes that users are looking for meetings based primarily on: whether the meeting is happening _soon_ (within a specific number of hours from now) and whether the location is _close_ to their current location (within a specific number of miles from their current location, defaulted to/assumed to be Parsons, specifically the [The New School University Center](https://goo.gl/maps/LSkFRX5fHJ52) address at lat: 40.7354868 | lon: -73.9935562). The relevant data users will need to find the meeting(s) that are a good fit for them and get to those meeting(s) are:

+ Geolocation / address (where is it on a map)
+ Location / address details (what is the meeting venue, how do I find it once I get there)
+ Meeting name and meeting type
+ Meeting schedule
+ Additional meeting details special interests, or accessibility concerns

## Query Structure

The [data query](https://github.com/ryanabest/data-structures/blob/master/final/routes/aa.js) for the current version of this interface pulls the above information, bringing in geolocation, location, meeting, and schedule data from my [PostgreSQL data structure](https://github.com/ryanabest/data-structures/blob/master/week4/data-structures_week4.md) for any meeting within a certain amount of _hours from now_ and a certain _distance from a specific location_ (defaulted to _Parsons_). These values are defaulted to __48 hours__ from now and __2 miles__ from Parsons, but users can change both these hours and miles parameters and see the map update accordingly – users can enter values up to 72 hours and 10 miles.

These mile and distance values are passed into the query itself so it only returns the meetings that match the given timeframe in the locations that match the given location constraints, ensuring we're querying the minimum amount of data needed to display only relevant meetings and locations.

The query returns one row per geolocation with a nested structure containing information about each location within a geolocation, each meeting within that location, and the schedule within each meeting that matches our time and location constraints:
![Sample query JSON response showing the nested data structure][aaJSON]

[aaJSON]: images/aaJSON.png "Sample query JSON response showing the nested data structure"

## Visual Representation of Data

First, each geolocation returned in our query is mapped to an individual marker and our map's default view is centered around our current location, with a zoom level representative of the distance constraint provided. Location markers are colored in a gradient based on distance from the current location, with darker colors representing closer meetings (while the default location is a contrasting red).:

![alt text][aa1]

[aa1]: images/aa1.png "Default interface view"

Information about the location(s), meeting(s), and schedule(s) at each meeting are mapped to a pop-out pane accessible via clicking on a individual marker. Hovering on a specific meeting geolocation changes our mouse to a pointer, prompting a click on that location. This click will highlight the selected map marker and bring up a pop-out side pane, which displays a text list providing (in order of hierarchical presentation):
+ Location name, address, and address details
+ Meeting name, meeting type
+ Meeting schedule within timeframe provided
+ Additional meeting details, topics of interest, and accessibility concerns

![Pop-out side panel interface view][aa2]

[aa2]: images/aa2.png "Pop-out side panel interface view"

The pop-out side pane also provides a back-arrow to close this detail and return to the default map view. The interaction design for the pop-out pane was based on Google Maps.

## Next Steps
+ Add meeting type and current location search to the filtering capabilities, allowing users to narrow query results to more relevant meetings and personalizing results for any user location
+ Iterate on pop-out side panel design, making sure that:
  + The current hierarchy _(Location &#8594; Meeting &#8594; Schedule)_ is the right one
  + That hierarchy is adequately portrayed in the text design of the side panel
  + The closing of the side panel to unselect the current location is intuitive
+ Add color legend for map markers
+ Add time color scheme (darker markers have meetings happening sooner) and allow users to switch color scheme is being applied
