const
    tableDB = 'azmoon_app',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    Kavenegar = require('kavenegar'),
    router = express.Router();
require('./middleware')
require('./otp')
//---------------------------------------
router
    .post('/users', [middleware.hashPWD], (req, res) => {
        delete req.body.password;
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                const token = middleware.sessionToken(data);
                //res.cookie("SESSIONID", token, { httpOnly: true, secure: true });
                res.set('Authorization', token);
                res.status(200).json(data);
                res.end();
            }
        });
    })
    .put('/users', [middleware.hashPWD], (req, res) => {
        delete req.body.password;
        let _id = req.body._id;
        delete req.body._id;
        delete req.body.$loki;
        delete req.body.meta;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, { $set: req.body }, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                const token = middleware.sessionTokenUpdate(data);
                //res.cookie("SESSIONID", token, { httpOnly: true, secure: true });
                res.set('Authorization', token);
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
                        const token = middleware.sessionTokenUpdate(data[0]);
                        res.set('Authorization', token);
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
    .get('/mobile_in_use/:mobile', (req, res) => {
        req.app.db.collection('azmoon_app').find({ $and: [{ isUser: true }, { 'user_info.mobile': req.params.mobile }] }).toArray((err, data) => {
            if (data && data.length > 0) res.json(true);
            else res.json(false);
        })
    })
    .get('/generate_security_code/:mobile', [middleware.generate_secrity_code, middleware.hashing], (req, res) => {
        if (req.body.scode == '000000') {
            res.set('s-token', '000000');
            res.json(false);
        } else {
            //res.set('s-token', req.body.hashcode);
            res.set('s-token', req.body.scode);
            res.json(true);
        }
    })
    .get('/check_security_code/:code', (req, res) => {
        // var hashing = new HASHING();    
        // if(hashing.verfiyHash(req.params.code, req.headers['s-token'])){
        //     res.json(true);
        // }else{
        //     res.json(false);
        // }
        res.json(true);
    })
    .get('/find_study_by_name/:name', (req, res) => {
        req.app.db.collection('azmoon_base').find({
            $and: [
                { study_code: { $exists: true } },
                { study_name: { $regex: req.params.name } }]
        }).toArray((err, data) => {
            res.json(data);
        })
    })


//---------------------------------------
module.exports = router