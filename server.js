const express = require('express')
http = require('http'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  app = express(),
  jwt = require('jsonwebtoken'),
  helmet = require('helmet'),
  compression = require('compression'),
  cors = require('cors')  
  mongoClient = require('mongodb').MongoClient;
//------------------------------------------------------------------------------
const url = 'mongodb://localhost:27017';
//const url = 'mongodb://172.18.200.11:27017';
const dbName = 'azmoon';
//------------------------------------------------------------------------------
app.use(function (req, res, next) {
  // res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  // res.header("Access-Control-Allow-Origin", "*");
  //res.header("Access-Control-Allow-Headers", "s-token");
  res.header('Access-Control-Expose-Headers', 's-token')
  next();
});

app
  .use(bodyParser.json({limit: '50mb'}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}))
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
  res.json(new Date());
})
//---------------------------------------------------------------
app.use('/api/azmoon_base', azmoon_base);
app.use('/api/azmoon_exam', azmoon_exam);
app.use('/api/azmoon_login', azmoon_login);
app.use('/api/azmoon_app', azmoon_app);
app.use('/api/azmoon_app', app_signup);
//===============================================================
const port = process.env.PORT || '5001';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));


