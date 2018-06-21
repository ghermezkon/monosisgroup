const
  express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser'),
  app = express(),
  helmet = require('helmet'),
  compression = require('compression'),
  cors = require('cors'),
  path = require('path'),
  mongoClient = require('mongodb').MongoClient,
  soap = require('soap'),
  crypto = require('crypto'),
  request = require('request');
CryptoJS = require("crypto-js");
require('./mongo/middleware');
//------------------------------------------------------------------------------
const port = process.env.PORT || '5001';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
var io = require('socket.io').listen(server);
app.set('io', io);
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
  .use(compression())
  .use(helmet())
  .use(cors())
//------------------------------------------------------------------------------  
mongoClient.connect(url, function (err, client) {
  console.log("Connected successfully rverto server");
  const db = client.db(dbName);
  app.db = db;
});
//---------------------------------------------------------------
app.get('/api/currentDate', (req, res) => {
  res.send(new Date());
});
//---------------------------------------------------------------
var html_dir = './html/';
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/html');
app.set('view engine', 'html');
app.use('/html', express.static(path.join(__dirname, 'html')));
//---------------------------------------------------------------
app.get('/api/getToken', (req, res) => {
  var data = '24020103;1010;1000';
  var secretKey = 'GDQPRU78BAO';

  //secretKey = Buffer.concat([secretKey, secretKey.slice(0, 8)]);
  var cipher = crypto.createCipher('des-ede3', secretKey);
  var SignData = cipher.update(data, 'utf8', 'base64');
  SignData += cipher.final('base64');
  console.log(SignData);

  // var keyHex = CryptoJS.enc.Base64.parse(secretKey);
  // SignData = CryptoJS.TripleDES.encrypt(data, keyHex, {
  //   iv: keyHex,
  //   mode: CryptoJS.mode.ECB,
  //   padding: CryptoJS.pad.Pkcs7
  // });
  // console.log(SignData.toString())

  // SignData = CryptoJS.TripleDES.encrypt(data, secretKey, {
  //   mode: CryptoJS.mode.ECB,
  //   padding: CryptoJS.pad.Pkcs7
  // });
  // console.log(SignData.toString())

  var param = {
    MerchantId: '000000140212149',
    TerminalId: '24020103',
    Amount: 1000,
    OrderId: 1010,
    LocalDateTime: new Date(),
    ReturnUrl: 'http://localhost:5001/verify',
    SignData: SignData
  }
  request.post({
    url: 'https://sadad.shaparak.ir/VPG/api/v0/Request/PaymentRequest',
    json: true,
    body: param
  }, function (error, response, body) {
    if (error) res.send(error);
    else { res.send(body) }
  });
})
app.post('/api/verify', function (req, res) {
  var url = 'https://sep.shaparak.ir/payments/referencepayment.asmx?WSDL';
  var args = { String_1: req.body.RefNum, String_2: req.body.MID };
  var args_reverse = { String_1: req.body.RefNum, String_2: req.body.MID, Password: '#Mehdi3385#', Amount: +req.body.Amount };
  var user_data = {};
  soap.createClient(url, function (err, client) {
    user_data = { msg_ok: 'تراکنش با موفقیت انجام گردید، در حال بازگشت به برنامه ...', flag: true, body: req.body }
    // client.verifyTransaction(args, function (err, result) {
    //   returnValue = result['result']['$value'];
    //   if (+returnValue > 0) {
    //     if (+returnValue == parseInt(req.body.Amount)) {
    //       user_data = { msg_ok: 'تراکنش با موفقیت انجام گردید، در حال بازگشت به برنامه ...', flag: true, body: req.body }
    //     } else {
    //       client.reverseTransaction(args_reverse, function (err, result) {
    //         let reverseValue = result['result']['$value'];
    //         if (+reverseValue == 1) {
    //           user_data = { msg_ok: 'تراکنش به حساب شما برگشت داده می شود، در حال بازگشت به برنامه ...', flag: false, body: req.body };
    //         }
    //       });
    //     }
    //   } else {
    //     user_data = { msg_ok: 'خرید انجام نگردید، در صورت کسر وجه مبلغ تا 72 ساعت دیگر به حساب شما برگشت داده می شود، در حال بازگشت به برنامه ...', flag: false, body: req.body }
    //   }
    // });
    req.body.student_id = req.body.ResNum.slice(25,49);
    req.body.exam_id = req.body.ResNum.slice(0,24);
    req.body.kharid_number = req.body.ResNum.slice(0, 49);
    req.body.kharid_date = new Date();

    app.db.collection('azmoon_payment').insert(req.body, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        var io = req.app.get('io');
        var clients = {}
        io.on('connection', socket => {
          clients[socket.id] = socket;
          socket.emit('data', JSON.stringify(user_data));
          socket.on('disconnect', function () {
            delete clients[socket.id];
            socket.removeAllListeners();
            socket.disconnect(true);
          });          
        });
        res.render('verify');
      }
    });
  });
});
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
var azmoon_base = require('./mongo/azmoon.base');
var azmoon_exam = require('./mongo/azmoon.exam');
var azmoon_login = require('./mongo/azmoon.login');
var azmoon_app = require('./mongo/azmoon.app');
var app_signup = require('./mongo/app.signup');

app.use('/api/azmoon_base', azmoon_base);
app.use('/api/azmoon_exam', azmoon_exam);
app.use('/api/azmoon_login', azmoon_login);
app.use('/api/azmoon_app', azmoon_app);
app.use('/api/azmoon_app_signup', app_signup);
//===============================================================

