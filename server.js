const
  express = require('express')
http = require('http'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  app = express(),
  jwt = require('jsonwebtoken'),
  helmet = require('helmet'),
  compression = require('compression'),
  cors = require('cors'),
  mongoClient = require('mongodb').MongoClient,
  crypto = require('crypto'),
  request = require("request");
dateFormat = require('dateformat');
require('./mongo/middleware')
const RSA_PRIVATE_KEY = fs.readFileSync('./security/rsa.private');
//------------------------------------------------------------------------------
//const url = 'mongodb://localhost:27017';
const url = 'mongodb://172.18.200.11:27017';
const dbName = 'azmoon';
//------------------------------------------------------------------------------
app.use(function (req, res, next) {
  res.header('Access-Control-Expose-Headers', 's-token, Authorization');
  next();
});
app
  .use(bodyParser.json({ limit: '50mb' }))
  .use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
  .use(bodyParser.json())
  .use(compression())
  .use(helmet())
  .use(cors())
//------------------------------------------------------------------------------
mongoClient.connect(url, function (err, client) {
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  app.db = db;
});
//---------------------------------------------------------------
var azmoon_base = require('./mongo/azmoon.base');
var azmoon_exam = require('./mongo/azmoon.exam');
var azmoon_login = require('./mongo/azmoon.login');
var azmoon_app = require('./mongo/azmoon.app');
var app_signup = require('./mongo/app.signup');
//---------------------------------------------------------------
app.get('/api/currentDate', (req, res) => {
  let merchantCode = 4438263;
  let terminalCode = 1615545;
  let amount = 10000;
  let redirectAddress = 'http://localhost:5001/api/verify';
  let invoiceNumber = 1020;
  let invoiceDate = '1397/02/30 12:43:21';
  let action = 1003;
  let timeStamp = dateFormat(new Date(), "yyyy/mm/dd, HH:mm:ss");

  let data = "#" + merchantCode + "#" + terminalCode + "#" + invoiceNumber +
    "#" + invoiceDate + "#" + amount + "#" + redirectAddress + "#" + action + "#" + timeStamp + "#";
  //------------------------------------------------
  const signer = crypto.createSign('SHA256');
  signer.update(data);
  let sign = signer.sign(RSA_PRIVATE_KEY, 'base64');
  let t = {
    'merchantCode': merchantCode,
    'terminalCode': terminalCode,
    'amount': amount,
    'redirectAddress': redirectAddress,
    'invoiceNumber': invoiceNumber,
    'invoiceDate': invoiceDate,
    'action': action,
    'timeStamp': timeStamp,
    'sign': sign
  }
  //------------------------------------------------
  request.post({
    "url": "https://pep.shaparak.ir/gateway.aspx",
    "body": JSON.stringify(t)
  }, (error, response, body) => {
    if (error) {
      //res.send(err);
      console.log(error);
    } else {
      res.send(body)
      //console.log(response);
    }
  });
});
app.get('/api/verify', (req, res) => {
  console.log(res);
})
//---------------------------------------------------------------
app.all('/api/azmoon_app/*', [middleware.verifyToken], (req, res, next) => {
  if (req.body.decode) {
    next();
  } else {
    res.status(403).send({
      message: 'No token provided.'
    });
  }
})
//---------------------------------------------------------------
app.use('/api/azmoon_base', azmoon_base);
app.use('/api/azmoon_exam', azmoon_exam);
app.use('/api/azmoon_login', azmoon_login);
app.use('/api/azmoon_app', azmoon_app);
app.use('/api/azmoon_app_signup', app_signup);
//===============================================================
const port = process.env.PORT || '5001';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));


