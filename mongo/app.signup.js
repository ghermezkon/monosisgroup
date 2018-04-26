const
    tableDB = 'azmoon_app',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
require('./middleware')1
//---------------------------------------
router
    .post('/users', [middleware.hashPWD], (req, res) => {
        delete req.body.password;
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                const token = middleware.sessionToken(data);
                res.cookie("SESSIONID", token, { httpOnly: true, secure: true });
                res.status(200).json(data);
                res.end();
            }
        });
    })
    .put('/users', [middleware.hashPWD], (req, res) => {
        delete req.body.password;
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, { $set: req.body }, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                const token = middleware.sessionTokenUpdate(data);
                res.cookie("SESSIONID", token, { httpOnly: true, secure: true });
                res.status(200).json(data);
                res.end();
            }
        });
    })
    .get('/app_login/:mobile/:password', (req, res) => {
        req.app.db.collection(tableDB).find({ $and: [{ isUser: { $exists: true } }, { 'user_info.mobile': req.params.mobile }] }).toArray((err, data) => {
            if (err) res.send(err);
            else {
                if (data && data.length > 0) {
                    const check = middleware.verifyPassword(req.params.password, data[0].passwordHash);
                    if (check) {
                        //delete data[0].passwordHash;
                        res.send(data[0]).end();
                    } else {
                        res.send(false)
                    }
                } else {
                    res.send(false)
                }
            }
        })
    })
//---------------------------------------
module.exports = router