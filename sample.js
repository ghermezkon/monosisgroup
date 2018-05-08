const express = require('express');
const app = express();
const port = 8865;
const http = require('http');

app.get('/pardano', function (req, res) {
  const options = {
    method: 'POST',
    uri: 'http://pardano.com/p/mobilepayment/0c153439632cdf6116476214e1f43a56532/100',
    json: true 
      // JSON stringifies the body automatically
  }
  ​
  http.request(options)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      // Deal with the error
    })
});
app.listen(port, function () {
  console.log('Example app listening on port' + port);
});