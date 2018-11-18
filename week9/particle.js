const { Client } = require('pg'),
      request = require('request'),
      nodemailer = require('nodemailer');


function createClient() {
  const client = new Client({
    user: 'ryanabest',
    host: 'datastructures.cbijimkrmieh.us-east-1.rds.amazonaws.com',
    database: 'datastructures',
    password: process.env.AWS_PW,
    port: 5432,
  });

  return client;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ryan.a.best@gmail.com",
    pass: process.env.GMAIL
  }
})

// If the particle isn't connected, send me an email letting me know then quit out

function sendEmail(body, callback) {
  let mailOptions = {
    from: 'ryan.a.best@gmail.com',
    to: 'bestr008@newschool.edu',
    subject: 'Particle Disconnected as of ' + new Date(),
    text: 'Tried to push data from the particle on ' + new Date() + ' and got a failure: ' + body
  }

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(new Date() + error);
    } else {
      console.log('We had a problem! Email sent: ' + new Date());
    }
  });
}

init();

function init() {
  // callAPI();
  setInterval(callAPI,30000);
}

function callAPI() {
  let apiURL = "https://api.particle.io/v1/devices/ryanabest-ds-temperature/analogvalue?access_token="  + process.env.PARTICLE;
  let particleData

  request(apiURL, function(err,resp,body) {
    if (err) { sendEmail(err,function() {throw "quitting" + new Date();}); }
    else {

      let results = JSON.parse(body);

      if (results.coreInfo.connected == null) {  sendEmail(JSON.stringify(results),function() {throw "quitting" + new Date();}); }

      else if (results.coreInfo.connected) {

        particleInit();

        function particleInit() {
          particleData = {
            name:               results.name,
            result:             results.result,
            last_heard:         results.coreInfo.last_heard,
            last_handshake_at:  results.coreInfo.last_handshake_at,
            device_id:          results.coreInfo.deviceID,
            product_id:         results.coreInfo.product_id
          }

          let query = particleQuery(particleData);

          runQuery(query);

        }

        function runQuery(query) {
          const client = createClient();
          client.connect();
          client.query(query, (err, res) => {
            if (err) {
              console.log(err.stack, new Date());
            } else {
              console.log(res.rowCount, new Date());
              client.end();
            }
          });
        }

        function particleQuery(data) {
          let query = `
            INSERT INTO particle_temperature (name,result,last_heard,last_handshake_at,device_id,product_id,date_added) VALUES
            (
               '`  + data.name + `'
               ,`  + data.result + `
               ,'` + data.last_heard + `'::TIMESTAMP WITH TIME ZONE
               ,'` + data.last_handshake_at + `'::TIMESTAMP WITH TIME ZONE
               ,'` + data.device_id + `'
               ,`  + data.product_id + `
               ,'` + new Date().toISOString() + `'::TIMESTAMP WITH TIME ZONE
            );
          `;

          return query
        }

      } else { sendEmail(JSON.stringify(results),function() {throw "quitting" + new Date();});}
    }
  });
}
