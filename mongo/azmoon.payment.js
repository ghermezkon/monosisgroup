const
    express = require('express'),
    router = express.Router(),
    _objectId = require('mongodb').ObjectID,
    Request = require("request");
//--------------------------------------
router
    .post('/savePayment', (req, res) => {
        req.app.db.collection('azmoon_payment').insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(200);
            }
        });
    })
//---------------------------------------
module.exports = router