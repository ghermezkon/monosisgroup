const
    tableDB = 'azmoon_base',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
//---------------------------------------
router
    .get('/school', (req, res) => {
        req.app.db.collection(tableDB).find({ school_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/school', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/school', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        })
    })
//---------------------------------------
router
    .get('/study', (req, res) => {
        req.app.db.collection(tableDB).find({ study_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/study', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/study', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        })
    })
//---------------------------------------    
router
    .get('/lesson', (req, res) => {
        req.app.db.collection(tableDB).find({ lesson_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/lesson/by_study/:study_name', (req, res) => {
        req.app.db.collection(tableDB).find({ $and: [{ lesson_code: { $exists: true } }, { 'study.study_name': req.params.study_name }] }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/lesson', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/lesson', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        })
    })
//-------------------------------------------------------------    
router
    .get('/teacher', (req, res) => {
        req.app.db.collection(tableDB).find({ teacher_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/teacher', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/teacher', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        })
    })
//---------------------------------------
module.exports = router