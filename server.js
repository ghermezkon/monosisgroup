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
  soap = require('soap');
require('./mongo/middleware');
//------------------------------------------------------------------------------
const port = process.env.PORT || '5001';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
var io = require('socket.io').listen(server);
app.set('io', io);
//------------------------------------------------------------------------------
const url = 'mongodb://localhost:27017';
//const url = 'mongodb://172.18.200.11:27017';
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
app.post('/api/verify', function (req, res) {
  var url = 'https://sep.shaparak.ir/payments/referencepayment.asmx?WSDL';
  var args = { String_1: req.body.RefNum, String_2: req.body.MID };
  var args_reverse = { String_1: req.body.RefNum, String_2: req.body.MID, Password: '#Mehdi3385#', Amount: +req.body.Amount };
  var user_data = {};
  soap.createClient(url, function (err, client) {
    client.verifyTransaction(args, function (err, result) {
      returnValue = result['result']['$value'];
      if (+returnValue > 0) {
        if (+returnValue == parseInt(req.body.Amount)) {
          user_data = { msg_ok: 'تراکنش با موفقیت انجام گردید، در حال بازگشت به برنامه ...', flag: true, body: req.body }
        } else {
          client.reverseTransaction(args_reverse, function (err, result) {
            let reverseValue = result['result']['$value'];
            if (+reverseValue == 1) {
              user_data = { msg_ok: 'تراکنش به حساب شما برگشت داده می شود، در حال بازگشت به برنامه ...', flag: false, body: req.body };
            }
          });
        }
      } else {
        user_data = { msg_ok: 'خرید انجام نگردید، در صورت کسر وجه مبلغ تا 72 ساعت دیگر به حساب شما برگشت داده می شود، در حال بازگشت به برنامه ...', flag: false, body: req.body }
      }
    });    
    app.db.collection('azmoon_payment').insert(req.body, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        var io = req.app.get('io');
        io.on('connection', socket => {
          socket.emit('data', JSON.stringify(user_data));
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

