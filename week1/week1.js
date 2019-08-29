// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');
var async = require('async');

let textFiles = [
   "https://parsons.nyc/aa/m01.html"
  ,"https://parsons.nyc/aa/m02.html"
  ,"https://parsons.nyc/aa/m03.html"
  ,"https://parsons.nyc/aa/m04.html"
  ,"https://parsons.nyc/aa/m05.html"
  ,"https://parsons.nyc/aa/m06.html"
  ,"https://parsons.nyc/aa/m07.html"
  ,"https://parsons.nyc/aa/m08.html"
  ,"https://parsons.nyc/aa/m09.html"
  ,"https://parsons.nyc/aa/m10.html"
]


// ASYNC METHOD
async.each(textFiles,function(textFile,callback) {
  let newFileName = textFile.split("/")[textFile.split("/").length-1]
  request(textFile, function(error, response, body){
      if (!error && response.statusCode == 200) {
        fs.writeFileSync('/Users/ryanbest/Documents/Parsons/ds-2018/data-structures/data/raw/' + newFileName, body);
      }
      else {console.log("Request failed!")}
    });
})

// CLOSURE METHOD WITH LET
for (let i=0;i<textFiles.length;i++) {
  let textFile = textFiles[i]
  let newFileName = textFile.split("/")[textFile.split("/").length-1]
  request(textFile, function(error, response, body){
      if (!error && response.statusCode == 200) {
        // console.log(body);
        fs.writeFileSync('/Users/ryanbest/Documents/Parsons/ds-2018/data-structures/data/raw/' + newFileName, body);
      }
      else {console.log("Request failed!")}
  });
}
