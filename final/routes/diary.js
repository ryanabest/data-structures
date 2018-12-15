const express = require('express'),
      router = express.Router(),
      moment = require('moment'),
      { Client } = require('pg');

// AWS Dynamo
const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";
const dynamodb = new AWS.DynamoDB();

let vizTypeDefault = "interactive viz";

function writeButtons(vizType) {
  let intClass = "select-button",
      staticClass = "select-button",
      portClass = "select-button";

  if (vizType === "interactive viz") { intClass += " active" }
  else if (vizType === "static viz") { staticClass += " active" }
  else if (vizType === "portfolio")  { portClass += " active" };
  return `
  <form method="POST" class="` + intClass + `">
    <input type="submit" name="vizType" value="INTERACTIVE VIZ"/>
  </form>
  <form method="POST" class="` + staticClass + `">
    <input type="submit" name="vizType" value="STATIC VIZ"/>
  </form>
  <form method="POST" class="` + portClass + `">
    <input type="submit" name="vizType" value="PORTFOLIO"/>
  </form>
  `
}

router.get('/', function(req, res) {
  let vizType = vizTypeDefault,
      buttons = writeButtons(vizType);

  // DynamoDB (NoSQL) query
  let params = {
      TableName : "deardiary_viz",
      KeyConditionExpression: `
        #typ = :topicName
        and #dt >= :minDate`, // the query expression
      ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
          "#typ" : "type",
          "#dt"  : "date"
      },
      ExpressionAttributeValues: { // the query values
          ":topicName": {S: "interactive viz"},
          ":minDate": {S: new Date("October 1, 2018").toLocaleDateString()}
      }
  };

  dynamodb.query(params, function(err, data) {
      if (err) { console.error("Unable to query. Error:", JSON.stringify(err, null, 2)); }
      else {
          let diaryData = data.Items,
              diary = '';

          diaryData.forEach(d => d.date.S = moment.utc(new Date(d.date.S)).local().format('YYYY-MM-DD HH:mm:ss'));
          diaryData.sort(function(a, b) {
            a = a.date.S;
            b = b.date.S;
            return a>b ? -1 : a<b ? 1 : 0;
          })
          diaryData.forEach(d => diary+='diaryData.push('+JSON.stringify(d)+');');
          res.render('diary', {title: 'Diary Interface - ' + vizType.toUpperCase(), diary: diary, buttons: buttons, vizType: vizType});
          console.log('Responded to Diary Request');
      }
  });
});

router.post('/', function(req,res) {
  let vizType = req.body.vizType.toLowerCase(),
      buttons = writeButtons(vizType);

  // DynamoDB (NoSQL) query
  let params = {
      TableName : "deardiary_viz",
      KeyConditionExpression: `
        #typ = :topicName
        and #dt >= :minDate`, // the query expression
      ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
          "#typ" : "type",
          "#dt"  : "date"
      },
      ExpressionAttributeValues: { // the query values
          ":topicName": {S: vizType},
          ":minDate": {S: new Date("October 1, 2018").toLocaleDateString()}
      }
  };

  dynamodb.query(params, function(err, data) {
      if (err) { console.error("Unable to query. Error:", JSON.stringify(err, null, 2)); }
      else {
          let diaryData = data.Items,
              diary = '';

          diaryData.forEach(d => d.date.S = moment.utc(new Date(d.date.S)).local().format('YYYY-MM-DD HH:mm:ss'));
          diaryData.sort(function(a, b) {
            a = a.date.S;
            b = b.date.S;
            return a>b ? -1 : a<b ? 1 : 0;
          })
          diaryData.forEach(d => diary+='diaryData.push('+JSON.stringify(d)+');');
          res.render('diary', {title: 'Diary Interface - ' + vizType.toUpperCase(), diary: diary, buttons: buttons, vizType: vizType});
          console.log('Responded to Diary Request');
      }
  });
});

module.exports = router;
