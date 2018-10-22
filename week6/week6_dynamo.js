const AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";
const dynamodb = new AWS.DynamoDB();

let params = {
    TableName : "deardiary_viz",
    KeyConditionExpression: `
      #typ = :topicName
      and #dt between :minDate and :maxDate`, // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#typ" : "type",
        "#dt"  : "date"
    },
    ExpressionAttributeValues: { // the query values
        ":topicName": {S: "interactive viz"},
        ":minDate": {S: new Date("October 1, 2018").toLocaleString()},
        ":maxDate": {S: new Date("October 31, 2018").toLocaleString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("\n ***** ***** ***** ***** ***** \n", item.info.M.link.S,"\n",item.name.S,"\n ***** ***** ***** ***** *****");
        });
    }
});
